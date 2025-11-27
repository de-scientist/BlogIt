import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Send, User, MessageSquare } from "lucide-react"; // 💡 Added icons
import { toast } from "sonner";
import React, { useState } from "react";

export default function ContactUs() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call delay
        setTimeout(() => {
            setIsSubmitting(false);
            // 💡 TOAST: Success message at bottom-left
            toast.success("Message sent successfully! We'll get back to you soon.", {
                position: "bottom-left",
            });
            // Reset form fields (if using controlled inputs)
        }, 1500);
    };

    return (
        // 💡 APPLIED: pt-16 (Navbar) and pl-4 (Sidebar)
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16 pl-4 pb-10">
            <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <Card className="shadow-2xl border border-gray-100 dark:border-slate-700 rounded-2xl dark:bg-slate-800">
                    <CardHeader className="text-center pb-4">
                        <Mail className="w-10 h-10 mx-auto text-purple-600 mb-2" />
                        <CardTitle className="text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text">
                            Get In Touch
                        </CardTitle>
                        <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">
                            We value your feedback. Drop a message below and we’ll get back shortly.
                        </p>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center mb-1">
                                    <User className="w-4 h-4 mr-2" /> Name
                                </label>
                                <Input
                                    placeholder="Your Name"
                                    className="bg-white dark:bg-slate-700 dark:text-white border-gray-300 dark:border-slate-600 focus:border-purple-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center mb-1">
                                    <Mail className="w-4 h-4 mr-2" /> Email
                                </label>
                                <Input
                                    type="email"
                                    placeholder="your@email.com"
                                    className="bg-white dark:bg-slate-700 dark:text-white border-gray-300 dark:border-slate-600 focus:border-purple-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center mb-1">
                                    <MessageSquare className="w-4 h-4 mr-2" /> Message
                                </label>
                                <Textarea
                                    placeholder="Write your message..."
                                    className="bg-white dark:bg-slate-700 dark:text-white border-gray-300 dark:border-slate-600 focus:border-purple-500"
                                    rows={6}
                                    required
                                />
                            </div>

                            <Button 
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-3 bg-gradient-to-r from-green-500 to-teal-400 text-white font-semibold rounded-xl shadow-lg shadow-green-500/50 hover:opacity-90 transition disabled:opacity-50"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Send className="w-4 h-4 mr-2 animate-pulse" /> Sending...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4 mr-2" /> Send Message
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}