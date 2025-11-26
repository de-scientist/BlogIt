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
Research shows that habits and repeated behaviors shape our brains more than sudden bursts of effort. Neural pathways strengthen when actions are repeated. That’s why small, regular actions compound into extraordinary outcomes over time.

Consider an aspiring musician practicing 20 minutes daily. It seems small at first, but in a year, that musician has invested over 120 hours. That’s a tangible edge over someone waiting for “inspiration” to strike.

---

## Examples From Everyday Life
- **The Writer:** J.K. Rowling wrote in cafes every day, often while facing rejection and criticism. Showing up consistently allowed her ideas to mature and her craft to sharpen.
- **The Athlete:** Michael Jordan famously said, "I’ve missed more than 9,000 shots in my career… I’ve lost over 300 games. And I’ve failed over and over again in my life. And that is why I succeed." His presence on the court, practice after practice, created mastery.
- **The Scientist:** Marie Curie’s persistence in the lab, despite skepticism and hardships, produced groundbreaking discoveries.

These examples prove that presence, not talent alone, separates success from mediocrity.

---

## Overcoming Obstacles
Showing up is never easy. Life throws challenges: fatigue, discouragement, distractions, and self-doubt. Yet, those who choose persistence develop resilience.

- **Tip:** Schedule a non-negotiable time for your craft or goals. Treat it as sacred.  
- **Tip:** Celebrate micro-wins. Recognizing small progress fuels motivation to continue.  
- **Tip:** Surround yourself with accountability partners. Shared commitment strengthens resolve.

---

## Building Momentum
Momentum is the reward for consistent action. Early effort may feel invisible, but every repetition compounds.

> "Small daily improvements over time lead to stunning results." – Robin Sharma

Use a journal or tracker to measure progress. Celebrate the tiny victories—they build the psychological momentum that makes showing up easier each day.

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
## Introduction: Becoming is a Journey
Life isn’t about sudden transformation. It’s about consistent growth, about becoming the person who can handle greater challenges, opportunities, and responsibilities.

> "We are what we repeatedly do. Excellence, then, is not an act, but a habit." – Aristotle

Becoming requires patience. It asks you to trust the process, to invest daily effort into incremental improvements.

---

## The Role of Habits
Habits are the scaffolding of identity. When you perform a small action repeatedly, it shapes your beliefs about yourself. The discipline of becoming is built on small, intentional habits that reinforce growth.

**Example:**  
- Morning routines: Meditation, journaling, exercise  
- Learning routines: 30 minutes of reading daily  
- Reflection routines: End-of-day review of achievements and challenges

---

## Overcoming Resistance
Resistance is part of growth. It manifests as procrastination, distraction, or self-doubt. Recognize it as a signal that you are stepping outside your comfort zone.

> "Resistance is a sign you’re on the right path." – Steven Pressfield

Practical tips to overcome resistance:  
- Break large tasks into micro-actions  
- Schedule non-negotiable time blocks  
- Pair discipline with accountability partners

---

## Examples of Becoming
- **Leaders:** Oprah Winfrey’s daily discipline in learning, reflection, and preparation built her media empire.  
- **Entrepreneurs:** Elon Musk tackled failures with relentless iteration, refining his ventures step by step.  
- **Artists:** Frida Kahlo honed her craft despite pain and personal challenges, producing timeless art.

---

## Reflection Exercise
Consider these questions:  
1. What habits define your current identity?  
2. Which new habits will move you toward your aspirational self?  
3. How will you sustain consistency amidst distractions?

---

## Closing Thoughts
Becoming is not a destination; it’s a journey. The discipline of showing up, learning, and adapting transforms ordinary people into extraordinary individuals.
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
## Introduction: Embrace the Valley
Life will challenge you. Valleys are inevitable, but they are not your end—they are preparation grounds for elevation.

> "The darkest hour is just before the dawn." – Thomas Fuller

Walking the valley with your head high isn’t denial—it’s courage, patience, and vision.

---

## Lessons from Hard Times
Adversity teaches lessons you cannot learn in comfort. Pain fosters empathy, humility, and problem-solving.

**Example:**  
- J.K. Rowling faced rejection and poverty before publishing Harry Potter.  
- Nelson Mandela endured 27 years of imprisonment but emerged a global leader.

---

## Strategies to Navigate Challenges
1. Maintain perspective: Remember this is a season, not a life sentence.  
2. Seek mentors: Guidance accelerates learning during tough times.  
3. Reflect: Journaling helps identify growth within struggle.

---

## Blockquote Insight
> "It is not the mountain we conquer, but ourselves." – Sir Edmund Hillary

---

## Reflection Exercise
Ask yourself:  
- What current valley am I in?  
- What skills or traits am I developing through this struggle?  
- How can I transform adversity into growth?

---

## Closing Thoughts
Your valleys are not prisons. They are preparation chambers for your ascent. Walk them with intention, dignity, and courage. One day, you’ll look back and thank them for the strength they carved within you.
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
## Introduction: Recognize Your Fear
Fear is natural. But it is not stronger than purpose. Your gift is bigger than the doubts that hold you back.

> "Do the thing you fear, and the death of fear is certain." – Ralph Waldo Emerson

---

## How Fear Holds Us Back
Fear disguises itself as caution. But often, it prevents action entirely, keeping potential locked away.

**Example:**  
- A writer hesitates to submit a manuscript.  
- An entrepreneur delays launching a business.  
- A speaker refuses the stage.

---

## Overcoming Fear
1. Reframe fear as guidance.  
2. Take micro-steps daily toward your goal.  
3. Focus on purpose, not perfection.

---

## Blockquote Insight
> "Fear is a natural reaction to moving closer to the truth." – Pema Chödrön

---

## Reflection Exercise
- Identify your biggest fear right now.  
- Write one bold action to confront it.  
- Commit to taking that step within 48 hours.

---

## Closing Thoughts
Your fear cannot extinguish your calling unless you let it. Step forward intentionally, boldly, and consistently. Your gift is waiting for the world.
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
## Introduction: Restarts as Renewal
Starting again is not failure—it’s recalibration. Life gives you endless opportunities to reset, refine, and relaunch.

> "Every new beginning comes from some other beginning’s end." – Seneca

---

## Lessons from Restarts
- Thomas Edison: thousands of failed experiments led to the lightbulb.  
- Steve Jobs: after being fired from Apple, he founded Pixar and returned stronger.  
- Any personal endeavor: every setback is a lesson.

---

## How to Start Again
1. Reflect on lessons learned.  
2. Identify what must change for better outcomes.  
3. Commit fully to the new approach.

---

## Reflection Exercise
- List one area of your life needing a restart.  
- Write a plan of three actionable steps.  
- Set a timeline and commit.

---

## Closing Thoughts
Starting again is a superpower. It’s not about losing; it’s about refining, evolving, and returning stronger than before. Embrace the reset.
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
## Introduction: Your Mind is Sacred
Your thoughts shape your world. Guard them carefully.

> "The mind is everything. What you think you become." – Buddha

---

## Strategies for Mental Stewardship
- Curate input: limit negativity, consume knowledge intentionally  
- Daily reflection: journaling, meditation  
- Affirmations: reinforce constructive thought patterns

---

## Examples in Practice
- Entrepreneurs focus on opportunity, not fear  
- Artists filter distractions to create masterpieces  
- Leaders cultivate clarity amidst chaos

---

## Reflection Exercise
- Identify recurring negative thoughts  
- Replace one with a positive actionable belief  
- Track your mental state daily for a month

---

## Closing Thoughts
Your mind is a kingdom. Rule it with intention. Protect it fiercely. Cultivate clarity, creativity, and courage. What you nurture internally manifests externally.
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
