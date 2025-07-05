import {
    Brain,
    MessageSquare,
    User,
    ListChecks,
    BookOpenCheck
} from 'lucide-react';
import React, { useState } from 'react';
import DashboardLayout from '../../layout/DashboardLayout';
import { AuthPostApi } from '../../services/API';
import { Apis } from '../../services/API';
import { handleApiError } from '../../utils/pageUtils';

const AiAssistant = () => {
    const [question, setQuestion] = useState('');
    const [messages, setMessages] = useState<{ sender: string; content: string }[]>([]);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [syllabus, setSyllabus] = useState<{ week: number; title: string }[]>([]);
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (!question.trim()) return;

        setMessages((prev) => [...prev, { sender: 'user', content: question }]);
        setLoading(true);
        setSuggestions([]);
        setSyllabus([]);

        try {
            await new Promise((resolve) => setTimeout(resolve, 1000)); // ⏳ Delay for 1 second
            let responseText = '';

            if (question.toLowerCase().includes('recommend')) {
                const interest = question.replace(/recommend|suggest/gi, '').trim();
                const res = await AuthPostApi(Apis.ai.recommend, { interest });

                if (res.status === 200 && res.suggestions) {
                    setSuggestions(res.suggestions);
                    responseText = `Here are some course suggestions for "${interest.charAt(0).toUpperCase()}${interest.slice(1)}":`;
                }

            } else if (question.toLowerCase().includes('syllabus')) {
                const topic = question.replace(/syllabus|topic|for/gi, '').trim();
                const res = await AuthPostApi(Apis.ai.generate_syllabus, { topic });

                if (res.status === 200 && res.syllabus) {
                    setSyllabus(res.syllabus);
                    responseText = `Here's a suggested syllabus for "${topic.charAt(0).toUpperCase()}${topic.slice(1)}":`;
                }

            } else {
                responseText = "Sorry, I can currently assist with *course recommendations* or *syllabus*. Try asking like:\n• Recommend Excel\n• Syllabus for VBA.";
            }

            setMessages((prev) => [...prev, { sender: 'ai', content: responseText }]);
        } catch (err) {
            handleApiError(err);
        } finally {
            setLoading(false);
            setQuestion('');
        }
    };


    return (
        <DashboardLayout>
            <div className="p-6 space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    {/* Header */}
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                            <Brain className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">AI Learning Assistant</h2>
                            <p className="text-gray-600 text-sm">Ask about syllabus or course recommendations</p>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="space-y-4 max-h-[400px] overflow-y-auto">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`p-4 rounded-lg ${msg.sender === 'ai' ? 'bg-gray-50' : 'bg-blue-50'}`}>
                                <div className="flex items-start space-x-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.sender === 'ai' ? 'bg-purple-100' : 'bg-blue-100'}`}>
                                        {msg.sender === 'ai' ? <Brain className="w-4 h-4 text-purple-600" /> : <User className="w-4 h-4 text-blue-600" />}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-gray-900 font-medium">{msg.sender === 'ai' ? 'AI Assistant' : 'You'}</p>
                                        <p className="text-gray-600 text-sm mt-1 whitespace-pre-wrap">{msg.content}</p>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Course Suggestions */}
                        {suggestions.length > 0 && (
                            <div className="p-4 bg-purple-50 rounded-lg">
                                <div className="flex items-start space-x-2 mb-2">
                                    <ListChecks className="w-5 h-5 text-purple-600" />
                                    <p className="text-purple-800 font-semibold text-sm">Suggested Courses:</p>
                                </div>
                                <ul className="list-disc pl-6 text-sm text-purple-700 space-y-1">
                                    {suggestions.map((item, idx) => (
                                        <li key={idx}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Syllabus */}
                        {syllabus.length > 0 && (
                            <div className="p-4 bg-green-50 rounded-lg">
                                <div className="flex items-start space-x-2 mb-2">
                                    <BookOpenCheck className="w-5 h-5 text-green-600" />
                                    <p className="text-green-800 font-semibold text-sm">Syllabus Outline:</p>
                                </div>
                                <ul className="list-decimal pl-6 text-sm text-green-700 space-y-1">
                                    {syllabus.map((item, idx) => (
                                        <li key={idx}>
                                            <strong>Week {item.week}:</strong> {item.title}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <div className="mt-6 flex items-center space-x-4">
                        <input
                            type="text"
                            value={question}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleSend();
                                }
                            }}
                            onChange={(e) => setQuestion(e.target.value)}
                            placeholder="Try: Recommend Excel or Syllabus for VBA"
                            className="flex-1 text-sm px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500"
                        />
                        <button
                            onClick={handleSend}
                            disabled={loading}
                            className="bg-gradient-to-r cursor-pointer from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 flex items-center space-x-2"
                        >
                            <MessageSquare className="w-4 h-4" />
                            <span>{loading ? 'Sending...' : 'Send'}</span>
                        </button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AiAssistant;
