import OpenAI from "openai";
import type { Patent } from "@shared/schema";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

interface PriorArtResult {
  patentId: string;
  title: string;
  description: string;
  similarityScore: number;
  source: string;
}

interface PatentValuation {
  estimatedValue: number;
  confidence: number;
  factors: string[];
  marketAnalysis: string;
  recommendations: string[];
}

interface SimilarityResult {
  similarityScore: number;
  confidence: number;
  analysis: string;
  riskLevel: 'low' | 'medium' | 'high';
}

interface PatentDraft {
  title: string;
  abstract: string;
  background: string;
  summary: string;
  detailedDescription: string;
  claims: string[];
  drawings?: string[];
}

class AIService {
  async performPriorArtSearch(description: string): Promise<PriorArtResult[]> {
    try {
      const prompt = `
        Analyze the following patent description and identify potential prior art. 
        Return a JSON array of similar patents with the following structure:
        {
          "results": [
            {
              "patentId": "US-XXXX-XXXX",
              "title": "Patent Title",
              "description": "Brief description",
              "similarityScore": 0.85,
              "source": "USPTO"
            }
          ]
        }
        
        Patent description: ${description}
        
        Focus on technical similarities, innovative aspects, and potential conflicts.
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a patent research expert. Analyze patent descriptions and identify prior art with high accuracy. Respond with JSON only."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 2000,
      });

      const result = JSON.parse(response.choices[0].message.content || '{"results": []}');
      return result.results || [];
    } catch (error) {
      console.error("Error in prior art search:", error);
      return [];
    }
  }

  async evaluatePatentValue(patent: Patent): Promise<PatentValuation> {
    try {
      const prompt = `
        Evaluate the commercial value of this patent based on market potential, innovation level, and industry trends.
        Return a JSON object with the following structure:
        {
          "estimatedValue": 450000,
          "confidence": 0.78,
          "factors": ["Market size", "Innovation level", "Commercial applicability"],
          "marketAnalysis": "Detailed market analysis",
          "recommendations": ["Licensing opportunities", "Market expansion"]
        }
        
        Patent Details:
        Title: ${patent.title}
        Description: ${patent.description}
        Category: ${patent.category}
        Status: ${patent.status}
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a patent valuation expert. Provide realistic commercial valuations based on market data and innovation potential. Respond with JSON only."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 1500,
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      return {
        estimatedValue: result.estimatedValue || 0,
        confidence: result.confidence || 0,
        factors: result.factors || [],
        marketAnalysis: result.marketAnalysis || "",
        recommendations: result.recommendations || [],
      };
    } catch (error) {
      console.error("Error in patent valuation:", error);
      return {
        estimatedValue: 0,
        confidence: 0,
        factors: [],
        marketAnalysis: "Valuation analysis unavailable",
        recommendations: [],
      };
    }
  }

  async detectSimilarity(sourceText: string, targetText: string): Promise<SimilarityResult> {
    try {
      const prompt = `
        Compare these two patent descriptions for similarity and potential conflicts.
        Return a JSON object with the following structure:
        {
          "similarityScore": 0.75,
          "confidence": 0.85,
          "analysis": "Detailed similarity analysis",
          "riskLevel": "medium"
        }
        
        Source Text: ${sourceText}
        Target Text: ${targetText}
        
        Focus on technical concepts, methodology, and potential infringement risks.
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a patent similarity expert. Analyze text similarity for potential patent conflicts. Respond with JSON only."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 1000,
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      return {
        similarityScore: result.similarityScore || 0,
        confidence: result.confidence || 0,
        analysis: result.analysis || "",
        riskLevel: result.riskLevel || 'low',
      };
    } catch (error) {
      console.error("Error in similarity detection:", error);
      return {
        similarityScore: 0,
        confidence: 0,
        analysis: "Similarity analysis unavailable",
        riskLevel: 'low',
      };
    }
  }

  async generatePatentDraft(input: {
    title: string;
    description: string;
    category: string;
  }): Promise<PatentDraft> {
    try {
      const prompt = `
        Generate a professional patent application draft based on the following information.
        Return a JSON object with the following structure:
        {
          "title": "Improved title",
          "abstract": "Patent abstract",
          "background": "Background section",
          "summary": "Summary section",
          "detailedDescription": "Detailed description",
          "claims": ["Claim 1", "Claim 2", "Claim 3"]
        }
        
        Input Information:
        Title: ${input.title}
        Description: ${input.description}
        Category: ${input.category}
        
        Generate professional, technical language suitable for patent applications.
        Include multiple detailed claims with proper patent terminology.
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a patent attorney expert. Generate professional patent application documents with proper legal and technical language. Respond with JSON only."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 3000,
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      return {
        title: result.title || input.title,
        abstract: result.abstract || "",
        background: result.background || "",
        summary: result.summary || "",
        detailedDescription: result.detailedDescription || "",
        claims: result.claims || [],
        drawings: result.drawings || [],
      };
    } catch (error) {
      console.error("Error in patent drafting:", error);
      return {
        title: input.title,
        abstract: "Patent draft generation unavailable",
        background: "",
        summary: "",
        detailedDescription: "",
        claims: [],
      };
    }
  }

  async classifyInnovation(description: string): Promise<{
    category: string;
    confidence: number;
    subcategories: string[];
    analysis: string;
  }> {
    try {
      const prompt = `
        Classify this innovation into appropriate patent categories.
        Return a JSON object with the following structure:
        {
          "category": "medical_technology",
          "confidence": 0.92,
          "subcategories": ["diagnostic devices", "medical imaging"],
          "analysis": "Detailed classification analysis"
        }
        
        Innovation Description: ${description}
        
        Use these main categories: medical_technology, software_ai, renewable_energy, manufacturing, biotechnology, automotive, telecommunications, other
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an innovation classification expert. Categorize innovations accurately based on technical content. Respond with JSON only."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 800,
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      return {
        category: result.category || 'other',
        confidence: result.confidence || 0,
        subcategories: result.subcategories || [],
        analysis: result.analysis || "",
      };
    } catch (error) {
      console.error("Error in innovation classification:", error);
      return {
        category: 'other',
        confidence: 0,
        subcategories: [],
        analysis: "Classification analysis unavailable",
      };
    }
  }
}

export const aiService = new AIService();
