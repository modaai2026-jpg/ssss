/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize Gemini client to avoid crashes if API key is missing
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Shopify intelligent Sidekick API Endpoint
app.post('/api/sidekick', async (req, res) => {
  try {
    const { message, history, storeState } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const ai = getGeminiClient();

    // Prepare systemic prompt with real-time store context
    const productsInfo = storeState?.products?.map((p: any) => 
      `- ${p.title} (SKU: ${p.sku}, Stock: ${p.inventory}, Price: €${p.price}, Status: ${p.status})`
    ).join('\n') || 'None';

    const ordersInfo = storeState?.orders?.map((o: any) => 
      `- Order ${o.name}: Buyer ${o.customerName}, Total: €${o.total}, Payment: ${o.paymentStatus}, Fullfillment: ${o.fulfillmentStatus}`
    ).join('\n') || 'None';

    const discountsInfo = storeState?.discounts?.map((d: any) =>
      `- Code: ${d.code}, Type: ${d.type}, Value: ${d.valueText}, Status: ${d.status}, Used: ${d.usageCount} times`
    ).join('\n') || 'None';

    const systemInstruction = 
      `You are Sidekick, Shopify's highly intelligent, professional, and helpful AI assistant built directly into the merchant admin console of "Atelier Noir" store.
      Your tone is elegant, objective, expert, and efficient. Avoid excessive punctuation, sales pitch hype, unnecessary pleasantries or robotic apologies.
      You help the merchant manage their inventory, analyze sales, draft beautiful minimalist product descriptions, generate discount coupon strategies, suggest segment targets, and troubleshoot setups.

      Current store environment details:
      Active Currency: € (EUR)
      Store Name: Atelier Noir
      
      Current Products:
      ${productsInfo}
      
      Recent Orders:
      ${ordersInfo}
      
      Active Discount Campaigns:
      ${discountsInfo}

      Keep replies concise, clear, and perfectly formatted in standard Markdown. Use bold headers for key terms.
      If the merchant asks you to write descriptions, write sophisticated, quiet-luxury-style copies. 
      If they ask to configure a discount or find low stock, refer to the actual data above.
      For example, the Ceramic Pour-Over Dripper only has 3 items left which is low stock!
      If they ask to do something that relates to store modification, provide the concrete Markdown suggestion and explicitly explain how they can apply it.`;

    // 1. If key is missing, run high-quality local response engine
    if (!ai) {
      console.log('Gemini API key is missing. Using intelligent mock response engine.');
      let reply = '';
      const prompt = message.toLowerCase();

      if (prompt.includes('low') || prompt.includes('stock') || prompt.includes('inventory') || prompt.includes('kucun')) {
        reply = `### ⚠️ Low Inventory Alert
Based on your real-time store levels:
1. **Ceramic Pour-Over Coffee Brewer** (SKU: \`MC-DRP-CHR\`) is critically low with only **3 units** left in inventory (2 at Main Warehouse, 1 at Berlin Outlet).

**Suggested actions:**
* Click the **Adjust** button next to Ceramic Pour-Over Coffee Brewer to replenish local counts.
* Or create a **Purchase Order** to restock from Mono Ceramics.`;
      } else if (prompt.includes('description') || prompt.includes('draft') || prompt.includes('copywrite') || prompt.includes('miaoshu') || prompt.includes('wenan')) {
        reply = `### Crafted Product Copy: Premium Linen Linen Loungewear
Here is a sophisticated, quiet-luxury-style description for your upcoming collection:

> *"Constructed from centuries-old Belgian flax weaves, our linen loungewear balances structure with ease. Designed with a generous silhouette that relaxes over time, the organic construction keeps it breathable in ambient heat and insulating in cooler drafts. A quiet statement for the home studio."*

**Fittings for your Metadata:**
* **Tags**: \`sustainable\`, \`linen\`, \`quiet-luxury\`, \`lounge\`
* **Recommended Price**: €79.00`;
      } else if (prompt.includes('discount') || prompt.includes('coupon') || prompt.includes('promotion') || prompt.includes('sconti') || prompt.includes('zhekou')) {
        reply = `### Proposed Coupon Strategy: FESTIVE15
To capture mid-season shoppers, here is a recommended discount structure:

* **Coupon Code**: \`FESTIVE15\`
* **Type**: Percentage discount (**15% OFF** entire catalog)
* **Minimum Requirement**: Spend at least €50.00
* **Target Segment**: *Abandoned Checkout* customers and *Returning* buyers.

You can click **Create Discount** in the Discounts menu to put this active immediately in Atelier Noir.`;
      } else if (prompt.includes('sale') || prompt.includes('performance') || prompt.includes('revenue') || prompt.includes('stats') || prompt.includes('shuju')) {
        reply = `### Store Performance Summary
* **Total Conversion Rate**: 2.8% (above industry benchmark of 1.5%)
* **Top Selling Item**: *Minimalist Leather Pocket Wallet* (€49.00) forming 35% of recent sales.
* **Open Orders**: **4 unfulfilled transactions** representing €580.00 in outstanding shipments.

Would you like me to recommend a targeted email automate sequence to capture the *Abandoned Checkout* customer segment (~€141.60 in recoverable carts)?`;
      } else {
        reply = `### Hello! I am Sidekick, your Store Assistant.
I am running in **Preview Mode**. To unlock real-time Gemini language generation, feel free to configure your **GEMINI_API_KEY** in the **Settings > Secrets** panel!

Currently, I can assist you with:
* 📦 **Low stock alerts**: Ask *"What items are low in stock?"*
* ✍️ **Product Copywriting**: Ask *"Draft an elegant description for a shirt"*
* 🏷️ **Campaign Ideas**: Ask *"Explain a good discount strategy"*
* 📊 **Store Analytics**: Ask *"How is my store performing?"*

How can I help you support Atelier Noir today?`;
      }

      return res.json({ text: reply, mode: 'fallback' });
    }

    // 2. Real Gemini SDK Call
    console.log('Gemini API key is defined. Making real API call.');
    
    // Map history to parts if present, or just pass prompt directly with system instruction
    const chatContents = history?.map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    })) || [];

    // Push current message
    chatContents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: chatContents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.2,
      }
    });

    const text = response.text || 'No response generated.';
    return res.json({ text, mode: 'gemini' });

  } catch (error: any) {
    console.error('Error in Sidekick API handler:', error);
    return res.status(500).json({ error: error.message || 'An unexpected failure occurred while querying the assistant.' });
  }
});

// AI Storefront Theme Generator Endpoint
app.post('/api/generate-theme', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Merchant description prompt is required' });
    }

    const ai = getGeminiClient();

    // 1. If Gemini API key is missing, synthesize premium design system via rule-based analysis
    if (!ai) {
      console.log('Gemini API key is missing. Deploying Offline Theme Synthesis Engine.');
      const text = prompt.toLowerCase();
      
      let themeName = 'Personalized Curated';
      let primaryColor = '#4f46e5'; // brand indigo
      let accentColor = '#6366f1'; 
      let backgroundColor = '#ffffff';
      let textColor = '#111827';
      let bannerTitle = 'Curated Lifestyle Design';
      let bannerSubtitle = 'Refined elements assembled with absolute geometric composure.';
      let bannerImage = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=80';

      if (text.includes('coffee') || text.includes('cafe') || text.includes('咖啡') || text.includes('豆') || text.includes('dessert') || text.includes('bakery') || text.includes('烘焙')) {
        themeName = 'Espresso & Crema';
        primaryColor = '#4e3629';
        accentColor = '#d97706';
        backgroundColor = '#fdfbfa';
        textColor = '#2b1b12';
        bannerTitle = 'Slow Drip & Single Origin';
        bannerSubtitle = 'Sourced globally, roasted locally in small-batch ceramic drums.';
        bannerImage = 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1200&q=80';
      } else if (text.includes('jewelry') || text.includes('jewel') || text.includes('珠宝') || text.includes('首饰') || text.includes('ring') || text.includes('戒指') || text.includes('gold') || text.includes('黄金')) {
        themeName = 'Aurelia Gilded';
        primaryColor = '#1e3a2f'; // emerald deep
        accentColor = '#d97706'; // copper gold
        backgroundColor = '#fcfcf9';
        textColor = '#111e17';
        bannerTitle = 'Gilded Precious Geometry';
        bannerSubtitle = 'Conflict-free stones sculpted in solid recycled karat gold.';
        bannerImage = 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1200&q=80';
      } else if (text.includes('flower') || text.includes('plant') || text.includes('garden') || text.includes('花') || text.includes('植物') || text.includes('绿') || text.includes('floral')) {
        themeName = 'Flora & Moss';
        primaryColor = '#166534'; // rich evergreen
        accentColor = '#db2777'; // flower pink
        backgroundColor = '#f4fbf7';
        textColor = '#062f17';
        bannerTitle = 'Ethical Botanics & Greenery';
        bannerSubtitle = 'Living sculptures and dried floral bundles hand-tied in linen ribbons.';
        bannerImage = 'https://images.unsplash.com/photo-1487070183336-b8a259c7af6f?w=1200&q=80';
      } else if (text.includes('tech') || text.includes('cyber') || text.includes('computer') || text.includes('mechanical') || text.includes('键盘') || text.includes('电脑') || text.includes('科技') || text.includes('terminal')) {
        themeName = 'Neo Cyber Terminal';
        primaryColor = '#7c3aed'; // neon violet
        accentColor = '#06b6d4'; // teal cyan
        backgroundColor = '#070312'; // deep slate black
        textColor = '#f5f3ff';
        bannerTitle = 'Anodized Mechanical Workstations';
        bannerSubtitle = 'Precision machined computer assemblies and high-contrast lightwells.';
        bannerImage = 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&q=80';
      } else if (text.includes('clothing') || text.includes('apparel') || text.includes('wear') || text.includes('衣服') || text.includes('服装') || text.includes('linens') || text.includes('minimal')) {
        themeName = 'Atelier Silhouettes';
        primaryColor = '#1d1918';
        accentColor = '#c2410c'; // rust orange
        backgroundColor = '#faf8f5';
        textColor = '#1a1615';
        bannerTitle = 'Architectural Apparel Linens';
        bannerSubtitle = 'Unstructured shirts and drapes using Belgian raw organic weaves.';
        bannerImage = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=80';
      } else if (text.includes('book') || text.includes('read') || text.includes('书') || text.includes('paper') || text.includes('print') || text.includes('journal')) {
        themeName = 'Papyrus & Ink';
        primaryColor = '#1c1917';
        accentColor = '#b45309';
        backgroundColor = '#f7f4ee';
        textColor = '#1c1917';
        bannerTitle = 'Independent Creative Print';
        bannerSubtitle = 'Exquisite quarterly magazines, self-published journals, and charcoal ink pens.';
        bannerImage = 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1200&q=80';
      } else if (text.includes('sport') || text.includes('gym') || text.includes('fitness') || text.includes('run') || text.includes('运动') || text.includes('健身') || text.includes('跑')) {
        themeName = 'Kinetic Pace';
        primaryColor = '#0f172a';
        accentColor = '#f43f5e'; // neon energetic pink
        backgroundColor = '#f8fafc';
        textColor = '#0f172a';
        bannerTitle = 'Uncompromising Athletic Armor';
        bannerSubtitle = 'Engineered fabrics with active moisture ventilation and seamless compression.';
        bannerImage = 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=1200&q=80';
      }

      const generatedId = 'theme_gen_' + Date.now();
      const generatedTheme = {
        id: generatedId,
        name: `${themeName} (AI-Generated)`,
        status: 'draft',
        logoUrl: '',
        primaryColor,
        accentColor,
        backgroundColor,
        textColor,
        headerStyle: 'inline',
        footerLayout: 'simple',
        footerText: `© 2026 ${themeName}. Powered by AI Design Systems.`,
        enableSlider: true,
        sliderBanners: [
          {
            id: 'banner_gen_1',
            imageUrl: bannerImage,
            title: bannerTitle,
            subtitle: bannerSubtitle,
            buttonText: 'Shop New Arrivals',
            buttonLink: '#products',
          }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      return res.json({ theme: generatedTheme, mode: 'fallback' });
    }

    // 2. Real Gemini SDK Call
    console.log('Gemini API key is defined. Querying Gemini for Design Theme configurations.');
    const systemPrompt = 
      `You are an elite, Shopify-caliber design system generator that helps boutique merchants customize their storefront branding.
      Based on the description of the client's business, output a fully customized website UI Theme Configuration.
      You MUST respond ONLY with a clean JSON object containing the exact following fields:
      {
        "name": "A refined, sophisticated Theme Preset name based on the description",
        "primaryColor": "A valid 6-character Hex color matching the identity (e.g. #111111)",
        "accentColor": "A contrasting gorgeous 6-character Hex color for CTAs/links",
        "backgroundColor": "A stunning eye-safe 6-character Hex background color",
        "textColor": "A matching high-contrast 6-character Hex body text color",
        "headerStyle": "inline",
        "footerLayout": "simple",
        "footerText": "Refined copyright footer statement including the store name",
        "bannerTitle": "A dramatic, poetic editorial headline matching the theme concept",
        "bannerSubtitle": "A sophisticated sub-headline expanding on the vision",
        "bannerImage": "A relevant premium Unsplash photo keyword URL (e.g., https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=80)"
      }
      
      Keep the design choices incredibly modern, elegant, and boutique. Use premium colors (soft off-whites, elegant botanical greens, deep rich espresso tones, anodized metal slates or clean quiet-luxury charcoal).
      Do NOT include any markdown code wrappers around the raw JSON output like \`\`\`json. Output ONLY raw parseable JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: [{ role: 'user', parts: [{ text: `Merchant Description: ${prompt}` }] }],
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.3,
        responseMimeType: 'application/json',
      }
    });

    const outputText = response.text || '{}';
    console.log('Gemini generated theme values:', outputText);
    const parsed = JSON.parse(outputText);

    const generatedId = 'theme_gen_' + Date.now();
    const generatedTheme = {
      id: generatedId,
      name: `${parsed.name || 'AI Custom Boutique'} (AI-Generated)`,
      status: 'draft',
      logoUrl: '',
      primaryColor: parsed.primaryColor || '#111111',
      accentColor: parsed.accentColor || '#4f46e5',
      backgroundColor: parsed.backgroundColor || '#ffffff',
      textColor: parsed.textColor || '#1f2937',
      headerStyle: parsed.headerStyle || 'inline',
      footerLayout: parsed.footerLayout || 'simple',
      footerText: parsed.footerText || `© 2026 ${parsed.name || 'Boutique Store'}. Powered by Gemini.`,
      enableSlider: true,
      sliderBanners: [
        {
          id: 'banner_gen_1',
          imageUrl: parsed.bannerImage || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80',
          title: parsed.bannerTitle || 'Sophisticated Tailoring Curations',
          subtitle: parsed.bannerSubtitle || 'Handcrafted items designed with compositions that fit everyday rhythm.',
          buttonText: 'Enter Store',
          buttonLink: '#products',
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return res.json({ theme: generatedTheme, mode: 'gemini' });

  } catch (error: any) {
    console.error('Error generating AI theme preset:', error);
    return res.status(500).json({ error: error.message || 'Theme synthesis failed' });
  }
});

// Configure Vite or Static File Serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Express server running on http://localhost:${PORT}`);
  });
}

startServer();
