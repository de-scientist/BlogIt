// src/pages/ContactUs.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ContactUs() {
  return (
    <div className="min-h-screen pt-24 pb-10 container mx-auto px-4">
      <Card className="max-w-2xl mx-auto shadow-xl border border-slate-300 dark:border-slate-700 rounded-2xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-slate-800 dark:text-slate-100 text-center">
            Contact Us
          </CardTitle>
          <p className="text-center text-slate-600 dark:text-slate-300">
            We’d love to hear from you. Drop a message and we’ll get back shortly.
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div>
            <label className="text-slate-700 dark:text-slate-300">Name</label>
            <Input
              placeholder="Your Name"
              className="mt-2 bg-white dark:bg-slate-800"
            />
          </div>

          <div>
            <label className="text-slate-700 dark:text-slate-300">Email</label>
            <Input
              type="email"
              placeholder="your@email.com"
              className="mt-2 bg-white dark:bg-slate-800"
            />
          </div>

          <div>
            <label className="text-slate-700 dark:text-slate-300">Message</label>
            <Textarea
              placeholder="Write your message..."
              className="mt-2 bg-white dark:bg-slate-800"
              rows={6}
            />
          </div>

          <Button className="w-full py-3 bg-gradient-to-r from-gray-400 to-gray-600 text-white font-semibold rounded-xl hover:opacity-90 transition">
            Send Message
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
