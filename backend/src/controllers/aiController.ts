
import { Request, Response } from 'express';

export const recommendCourses = async (req: Request, res: Response): Promise<void> => {
  const { interest } = req.body;

  if (!interest) {
    res.status(400).json({ message: 'Interest is required' });
    return;
  }
  const capitalizedInterest = interest.charAt(0).toUpperCase() + interest.slice(1);

  // 🔁 Mock data based on interest
  const suggestions = [
    `Introduction to ${capitalizedInterest}`,
    `Principles of ${capitalizedInterest}`,
    `${capitalizedInterest} in Practice`,
    `Advanced ${capitalizedInterest} Techniques`,
    `${capitalizedInterest} Capstone Project`,
  ]

  res.status(200).json({
    message: 'Mocked course suggestions',
    interest,
    status: 200,
    suggestions,
  });
};




export const generateSyllabus = async (req: Request, res: Response): Promise<void> => {
  const { topic } = req.body;
  if (!topic) {
    res.status(400).json({ message: 'Topic is required' });
    return;
  }

  const capitalizedTopic = topic.charAt(0).toUpperCase() + topic.slice(1);
  // Mock syllabus
  const syllabus = [
    { week: 1, title: `Introduction to ${capitalizedTopic}` },
    { week: 2, title: 'Core Concepts and History' },
    { week: 3, title: 'Tools and Technologies' },
    { week: 4, title: 'Case Studies' },
    { week: 5, title: 'Hands-on Project' },
    { week: 6, title: 'Advanced Techniques' },
    { week: 7, title: 'Research and Trends' },
    { week: 8, title: 'Final Presentation & Evaluation' },
  ];
  ;

  res.status(200).json({
    message: 'Mocked syllabus generated',
    topic,
    status: 200,
    syllabus,
  });
};

