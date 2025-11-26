import { useParams } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const blogs = [
  {
    id: 1,
    title: "The Quiet Power of Showing Up",
    synopsis: "Greatness isn’t born in noise—it’s forged in consistency.",
    description:
      "Small steps compound into momentum. Momentum compounds into transformation.",
    image: "/images/inspire1.jpeg",
    content: `
## Introduction: The Hidden Strength in Consistency
When the world feels loud and overwhelming, showing up becomes a rebellion. Not for applause. Not for recognition. But for yourself. The days you feel the weakest often become the days that sculpt your strength.

> "Success is built quietly, one small step at a time." – Unknown

Every person you admire has one thing in common: they showed up. Day after day. Consistency creates trust, mastery, and ultimately, impact. The challenge isn’t talent—it’s presence.

---

## The Science Behind Showing Up
Research shows that habits and consistent behaviors shape our brains more than sudden bursts of effort. Neural pathways strengthen when actions are repeated. That’s why small, regular actions compound into extraordinary outcomes over time.

Consider an aspiring musician practicing 20 minutes daily. It seems small at first, but in a year, that musician has invested over 120 hours. That’s a tangible edge over someone waiting for “inspiration” to strike.

---

## Examples From Everyday Life
- **The Writer:** J.K. Rowling wrote in cafes every day, often while facing rejection and criticism. Showing up consistently allowed her ideas to mature and her craft to sharpen.
- **The Athlete:** Michael Jordan famously said, "I’ve missed more than 9,000 shots in my career… I’ve lost over 300 games. And I’ve failed over and over again in my life. And that is why I succeed." His presence on the court, practice after practice, created mastery.

These examples prove that presence, not talent alone, separates success from mediocrity.

---

## Overcoming Obstacles
Showing up is never easy. Life throws challenges: fatigue, discouragement, distractions, and self-doubt. Yet, those who choose persistence develop resilience.

- **Tip:** Schedule a non-negotiable time for your craft or goals. Treat it as sacred.  
- **Tip:** Celebrate micro-wins. Recognizing small progress fuels motivation to continue.  
- **Tip:** Surround yourself with accountability partners. Shared commitment strengthens resolve.

---

## The Long-Term Rewards
Consistency creates compounding returns:

- Trust and reliability in relationships and work  
- Improved skills and expertise  
- A strong internal sense of identity and discipline  
- Momentum that attracts opportunities  

> “Success doesn’t come from what you do occasionally; it comes from what you do consistently.” – Marie Forleo

---

## Reflection Exercise
Take a moment to journal:

1. Where in your life are you inconsistent?  
2. What is one action you can commit to doing every day for the next 30 days?  
3. How will you measure progress and stay accountable?

By embedding this practice, showing up becomes not a chore, but a deliberate act of empowerment.

---

## Closing Thoughts
Your presence is a seed. Consistency is the water. Time is the sunlight. And when you are ready, your garden will bloom in ways you cannot yet imagine. Showing up—even when unseen—is the quiet rebellion that builds extraordinary lives.
    `,
  },
  {
    id: 2,
    title: "The Discipline of Becoming",
    synopsis: "You don’t attract the life you want—you grow into it.",
    description:
      "Your habits shape your identity, and your identity shapes your destiny.",
    image: "/images/inspire2.jpeg",
    content: `
Becoming isn’t magic. It’s sweat. It’s silence. It's choosing purpose over pleasure. Every routine is a seed. Every sacrifice is sunlight. Every morning you rise is rain. One day, the garden inside you blooms—and the world calls it success.

The journey of becoming is personal. It doesn’t require comparison. It requires reflection. It requires embracing discomfort. Growth is rarely convenient, and comfort is rarely transformative. The path to mastery and fulfillment demands consistent, disciplined choices every day.

Discipline is freedom. Ironically, the more you train your focus, your habits, and your mind, the more expansive your life becomes. You gain control over your attention, your time, and your actions. You are no longer subject to whims, distractions, or reactive impulses. You become deliberate. You become intentional. 

Every choice, however small, accumulates into a life aligned with your values. The books you read, the conversations you have, the thoughts you entertain, the work you put in—these compound silently. You become the sum of what you consistently do, not what you occasionally dream about.

Embrace the mundane, the repetitive, the hard work. It is here, in the quiet discipline, that greatness grows. Every morning you wake, every plan you execute, every self you refine is a step toward becoming who you were meant to be.
`,
  },
  {
    id: 3,
    title: "Walk the Valley With Your Head High",
    synopsis: "Even shadows prove that light exists.",
    description:
      "Tough seasons aren’t dead ends; they are corridors leading to stronger rooms.",
    image: "/images/inspire3.jpeg",
    content: `
Darkness isn’t your enemy—it’s your instructor. It teaches patience, endurance, and clarity. Walk the valley with your head high, warrior. You’re not buried. You’re being planted.

Hard times are not punishments—they are the soil in which resilience grows. Each challenge tests your limits, stretches your perspective, and refines your character. Pain can be a sculptor of your potential if you let it teach instead of deter.

Notice the lessons hidden in adversity. Embrace the uncertainty and use it to examine what matters most. The difficulties you face are not permanent. They are transient corridors that guide you toward a stronger, wiser self.

Stand tall, even when fear tries to bow you. Move forward, even when the path is unclear. The strength you cultivate during these times becomes the foundation for everything you will achieve. Shadows only exist because there is light. Your trials are proof that brighter days are coming. Every step you take with courage and awareness moves you closer to the horizon you are destined for.
`,
  },
  {
    id: 4,
    title: "Your Gift Is Bigger Than Your Fear",
    synopsis: "Fear whispers; purpose roars.",
    description:
      "Fear only survives when you stop moving. Boldness starves it.",
    image: "/images/inspire4.jpeg",
    content: `
Your gift wasn’t meant to die inside your doubts. It was designed to breathe on stages, pages, screens, hearts. Step toward the calling—even with shaking hands. Courage grows with motion, not certainty.

Fear is a signal, not a prison. It marks the boundary of comfort, inviting growth. Each time you move despite fear, you expand the territory of possibility. Every step you take toward your purpose diminishes the grip of fear.

Your potential is bigger than the shadows cast by hesitation. Let passion, curiosity, and dedication guide you forward. Fear may roar, but your purpose has a voice louder than any doubt. Take that first action. Write that page. Speak that word. Create that work.

By showing up in alignment with your calling, fear transforms into fuel. It teaches you to be vigilant, courageous, and resilient. Your gift will find its audience because courage attracts opportunity. Move forward relentlessly. Your purpose deserves presence.
`,
  },
  {
    id: 5,
    title: "The Beauty of Starting Again",
    synopsis: "Failure is not the opposite of success—it's the raw material.",
    description:
      "Every restart is a sharpened version of who you were before.",
    image: "/images/inspire5.jpeg",
    content: `
Starting again doesn’t mean you lost. It means you learned. You are returning to the battlefield with better armor, keener vision, and scars that make you wiser. Begin again—this time with fire.

Failure and endings are part of the rhythm of growth. Each reset is a lesson disguised as disruption. They provide clarity, humility, and renewed focus. Use what you’ve learned. Honor the experience. Then pivot, refine, and recommit.

Courage is required to start anew. Hope is required to persist. Vision is required to steer through the unknown. Every restart carries the opportunity to build stronger systems, make wiser choices, and craft a life aligned with your purpose.

Embrace the process. Celebrate progress. Recognize that mastery and transformation require iteration. Begin again with confidence, armed with the wisdom of experience, and let the journey unfold with intention.
`,
  },
  {
    id: 6,
    title: "Guard Your Mind Like A Kingdom",
    synopsis: "Your thoughts are architects, not spectators.",
    description:
      "Where your mind goes, your life eventually follows.",
    image: "/images/inspire6.jpeg",
    content: `
Protect your peace as though it's the crown jewel of your kingdom. Let no thought enter unchallenged. Let no fear reign unchecked. Rule your mind with intentionality—and your life becomes a masterpiece.

Your thoughts are the architects of your reality. Every belief, idea, and reflection builds the framework for your actions, relationships, and results. Mindfulness is the defense, discipline is the guide, and self-awareness is the key.

Evaluate what you allow into your consciousness. Guard against negativity, unproductive comparisons, and distractions that dilute focus. Instead, feed your mind with insight, inspiration, and constructive challenge.

By intentionally curating your inner world, you create the environment for innovation, resilience, and creativity to flourish. The external world may be chaotic, but your internal kingdom can remain sovereign, vibrant, and aligned with your purpose. Invest daily in your thoughts. Protect them fiercely. The life you desire is constructed from the fortress of your mind.
`,
  },
];

export default function InspirationSingle() {
  const { id } = useParams();
  const blog = blogs.find((b) => b.id === Number(id));

  if (!blog) {
    return (
      <div className="pt-28 text-center text-slate-600 dark:text-slate-300">
        <h2 className="text-2xl font-semibold">Blog not found</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen container mx-auto px-4 pt-28 pb-16">
      <Card className="max-w-4xl mx-auto shadow-xl border border-slate-300 dark:border-slate-700 rounded-2xl">
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-72 object-cover rounded-t-2xl"
        />

        <CardHeader>
          <CardTitle className="text-3xl font-bold text-slate-800 dark:text-slate-100">
            {blog.title}
          </CardTitle>
          <p className="text-slate-600 dark:text-slate-300 mt-2">
            {blog.synopsis}
          </p>
        </CardHeader>

        <CardContent>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-6">
            {blog.description}
          </p>

          <div className="whitespace-pre-line text-slate-800 dark:text-slate-200 leading-relaxed text-lg">
            {blog.content}
          </div>
        </CardContent>
      </Card>
      {/* CTA Button for Creating a Blog */}
      <div className="mt-12 text-center">
        <Link to="/blogs/create">
          <Button className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-10 py-4 rounded-xl shadow-xl hover:opacity-90 transition-all font-semibold">
            Create Your Own Blog
          </Button>
        </Link>
      </div>
    </div>
  );
}
