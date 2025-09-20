import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || "default_key" 
});

export interface PortfolioGenerationRequest {
  focus: string;
  targetField: string;
  additionalContext?: string;
  studentData: {
    name: string;
    studentId: string;
    gpa: string;
    activities: any[];
    courses: any[];
    achievements: any[];
  };
  apiKey?: string;
}

export interface GeneratedPortfolio {
  introduction: string;
  academicBackground: string;
  extracurricularActivities: string;
  skills: string[];
  achievements: string;
  conclusion: string;
  fullContent: string;
}

export async function generatePortfolio(
  request: PortfolioGenerationRequest,
  customApiKey?: string
): Promise<GeneratedPortfolio> {
  const clientOpenAI = customApiKey 
    ? new OpenAI({ apiKey: customApiKey })
    : openai;

  try {
    const prompt = `
Create a comprehensive professional portfolio for a student with the following details:

Student Information:
- Name: ${request.studentData.name}
- Student ID: ${request.studentData.studentId}
- GPA: ${request.studentData.gpa}
- Portfolio Focus: ${request.focus}
- Target Field: ${request.targetField}

Activities and Achievements:
${request.studentData.activities.map(activity => 
  `- ${activity.type}: ${activity.title} by ${activity.provider} (${activity.status})`
).join('\n')}

Academic Courses:
${request.studentData.courses.map(course => 
  `- ${course.title} (${course.progress}% complete)`
).join('\n')}

Additional Context:
${request.additionalContext || 'None provided'}

Please generate a professional portfolio with the following sections:
1. Introduction (personal summary and career objectives)
2. Academic Background (education, GPA, relevant coursework)
3. Extracurricular Activities (organized activities, leadership roles, volunteer work)
4. Skills (technical and soft skills derived from activities)
5. Achievements (awards, certifications, notable accomplishments)
6. Conclusion (future goals and aspirations)

Format the response as JSON with these exact keys: introduction, academicBackground, extracurricularActivities, skills (as array), achievements, conclusion, and fullContent (complete portfolio text).

Make it professional, engaging, and tailored for ${request.focus} applications in ${request.targetField}.
    `;

    const response = await clientOpenAI.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are an expert career counselor and portfolio writer who creates compelling, professional portfolios for students. Always respond with valid JSON format."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content generated from OpenAI");
    }

    const portfolio = JSON.parse(content) as GeneratedPortfolio;
    
    // Ensure all required fields are present
    if (!portfolio.introduction || !portfolio.academicBackground || !portfolio.skills) {
      throw new Error("Invalid portfolio structure generated");
    }

    return portfolio;

  } catch (error) {
    console.error("Portfolio generation error:", error);
    throw new Error(`Failed to generate portfolio: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function enhanceActivityDescription(
  activityTitle: string,
  activityType: string,
  provider: string,
  customApiKey?: string
): Promise<string> {
  const clientOpenAI = customApiKey 
    ? new OpenAI({ apiKey: customApiKey })
    : openai;

  try {
    const response = await clientOpenAI.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: "You are an expert at writing professional descriptions for academic and extracurricular activities. Create compelling, concise descriptions that highlight impact and learning outcomes."
        },
        {
          role: "user",
          content: `Write a professional description for this activity:
Activity: ${activityTitle}
Type: ${activityType}
Provider: ${provider}

The description should be 2-3 sentences, highlighting skills gained, impact created, or knowledge acquired. Make it suitable for a professional portfolio or resume.`
        }
      ],
    });

    return response.choices[0].message.content || "Professional development activity";
  } catch (error) {
    console.error("Activity description enhancement error:", error);
    return `Professional ${activityType.toLowerCase()} focused on ${activityTitle} through ${provider}`;
  }
}
