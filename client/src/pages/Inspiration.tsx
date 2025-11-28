import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Lightbulb, PenTool } from "lucide-react"; // 💡 Added icons

const blogs = [
  {
    id: 1,
    title: "The Quiet Power of Showing Up",
    synopsis: "Greatness isn’t born in noise—it’s forged in consistency.",
    description:
      "Small steps compound into momentum. Momentum compounds into transformation.",
    image: "/images/inspire1.jpeg",
    content: `
      When the world feels loud and overwhelming, showing up becomes a rebellion.
      Not for applause. Not for recognition. But for yourself.
      The days you feel the weakest often become the days that sculpt your strength.
      Keep showing up—your future self is building a throne from these bricks.
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
      Becoming isn’t magic. It’s sweat. It’s silence. It's choosing purpose over pleasure.
      Every routine is a seed. Every sacrifice is sunlight. Every morning you rise is rain.
      One day, the garden inside you blooms—and the world calls it success.
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
      Darkness isn’t your enemy—it’s your instructor.
      It teaches patience, endurance, and clarity.
      Walk the valley with your head high, warrior.
      You’re not buried. You’re being planted.
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
      Your gift wasn’t meant to die inside your doubts.
      It was designed to breathe on stages, pages, screens, hearts.
      Step toward the calling—even with shaking hands.
      Courage grows with motion, not certainty.
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
      Starting again doesn’t mean you lost.
      It means you learned.
      You are returning to the battlefield with better armor, keener vision,
      and scars that make you wiser.
      Begin again—this time with fire.
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
      Protect your peace as though it's the crown jewel of your kingdom.
      Let no thought enter unchallenged. Let no fear reign unchecked.
      Rule your mind with intentionality—and your life becomes a masterpiece.
    `,
  },

 {
  id: 7,
  title: "Ink That Refuses to Die",
  synopsis: "When words burn, they leave ashes that whisper truth.",
  description:
    "Poetry becomes the refuge where broken pieces learn to breathe again.",
  image: "/images/poetry1.jpeg",
  content: `
## Introduction: Where Emotion Meets the Page
Some poems aren’t written—they escape. They leak from the cracks of a tired soul trying to stay whole. Poetry is survival, stitched in metaphors.

> "The pen bleeds so the heart can heal."

---

## Why Poetry Still Matters  
In a world loud with noise, poetry remains the final sanctuary—where thoughts slow, emotions sharpen, and silence becomes a teacher.

---

## The Poet’s Burden  
Every poet carries:
- A wound they refuse to let rot  
- A truth they refuse to dilute  
- A rhythm they cannot silence  

Poetry is rebellion disguised as softness.

---

## Reflection  
Write a four-line truth today.  
Not for the world.  
For yourself.

---

## Closing  
Your words won’t save the world.  
But they might save **you**, and that is enough.
  `,
}, 

{
  id: 8,
  title: "The Future Belongs to the Builders",
  synopsis: "In the digital age, creation is the highest currency.",
  description:
    "Technology rewards those bold enough to explore, experiment, and break boundaries.",
  image: "/images/tech1.jpeg",
  content: `
## Introduction: The Wild Terrain of Innovation
The world doesn’t wait for permission. It shifts. It breaks. It rebirths. And only the builders keep up.

---

## Why Tech Favors the Brave  
Innovation is messy. The best ideas come from trial, error, and ruthless curiosity.  
The brave don’t fear complexity—they study it, bend it, and sculpt it.

> "Curiosity is the engine. Execution is the vehicle."

---

## Trends Reshaping the World  
- AI as the new electricity  
- Blockchain redefining ownership  
- Cloud turning ideas into global products  
- Robotics automating the impossible  

---

## Challenge  
Learn one tool deeply this month. Mastery compounds.

---

## Closing  
The future isn’t promised.  
But it is programmable.
  `,
},

{
  id: 9,
  title: "Eat for the Life You Want",
  synopsis: "Food is not fuel—it's strategy.",
  description:
    "Your body reflects the choices you make when no one is watching.",
  image: "/images/nutrition1.jpeg",
  content: `
## Introduction: Your Plate Is a Silent Coach
Nutrition isn’t a punishment or a diet—it’s self-respect served warm.

---

## Why Eating Well Matters  
Your energy, focus, mood, immunity—all rooted in what you feed your cells.

> "Your body is always listening."

---

## Smart Choices for Busy People  
- Swap sugar for fruit  
- Swap fried for grilled  
- Drink water like it’s medicine  
- Build colorful plates  

---

## Reflection  
What is one food habit you will drop this week?  
Which one will you adopt?

---

## Closing  
Eat with intention.  
Live with direction.
  `,
},

{
  id: 10,
  title: "The Body Remembers Everything",
  synopsis: "Healing starts when you stop ignoring your limits.",
  description:
    "Your health is either your greatest ally or your most silent enemy.",
  image: "/images/health1.jpeg",
  content: `
## Introduction: The Unspoken Truth  
Your body has been absorbing your decisions for years—your stress, your sleep, your habits, your excuses.

---

## Why Listening to Your Body Matters  
Pain is communication. Fatigue is communication.  
Your body is not failing; it's signaling.

> "If you don’t pick a day to rest, your body will pick it for you."

---

## Essentials for Sustainable Health  
- Sleep like your survival depends on it  
- Move your body daily  
- Drink water before your body begs  
- Cut toxic routines  

---

## Challenge  
Give your body 10 days of discipline.  
See what shifts.

---

## Closing  
Respect the vessel.  
It’s the only one you get.
  `,
},

{
  id: 11,
  title: "The Heart of a Soldier",
  synopsis: "Strength is not muscle. It's mindset.",
  description:
    "A soldier’s courage is forged long before they touch the battlefield.",
  image: "/images/kdf1.jpeg",
  content: `
## Introduction: Courage in Silence  
True bravery is rarely loud. It lives in sacrifice, discipline, and impossible endurance.

---

## What Makes a Soldier Different  
It’s not just the uniform.  
It’s the unwavering commitment to duty—even when fear whispers louder.

> "Where others step back, a soldier steps forward."

---

## Lessons From the Military  
- Discipline beats motivation  
- Teamwork saves lives  
- Training reveals character  
- Sacrifice builds nations  

---

## Reflection  
Where in your life do you need soldier-like discipline?

---

## Closing  
Honor those who carry more than we see.
  `,
},

{
  id: 12,
  title: "Study Like Your Future Is Watching",
  synopsis: "Academic success doesn’t come from intelligence—it comes from intention.",
  description:
    "Your study habits shape the opportunities that shape your destiny.",
  image: "/images/academics1.jpeg",
  content: `
## Introduction  
Grades aren’t everything, but discipline is.  
Studying is not punishment—it’s investment.

---

## Why Students Struggle  
Not because the work is hard, but because the habits are weak.

> "The mind thrives on repetition."

---

## High-Impact Study Strategies  
- Pomodoro technique  
- Spaced repetition  
- Active recall  
- Teaching others  

---

## Challenge  
Pick one technique and use it for 7 days.

---

## Closing  
Your future self is watching.  
Give them something to be proud of.
  `,
},

{
  id: 13,
  title: "The Discipline Blueprint",
  synopsis: "Motivation fades. Discipline endures.",
  description:
    "A strong mind outperforms talent in the long run.",
  image: "/images/mindset1.jpeg",
  content: `
## Introduction  
Everyone wants success; few want the grind attached to it.

---

## Why Discipline Wins  
Motivation sparks action.  
Discipline sustains it.

> "If you control your habits, you control your destiny."

---

## Building an Unbreakable Mind  
- Remove distractions  
- Build routines  
- Set boundaries  
- Commit publicly  

---

## Reflection  
Where do you sabotage yourself the most?  
Fix that.

---

## Closing  
Discipline is the door.  
Walk through it.
  `,
},

{
  id: 14,
  title: "Where Ideas Go to Breathe",
  synopsis: "Creativity grows in the spaces you refuse to ignore.",
  description:
    "Every mind has a story waiting to be born.",
  image: "/images/creativity1.jpeg",
  content: `
## Introduction  
Creativity isn’t magic—it’s awareness.  
Ideas hide in conversations, mistakes, silence, and chaos.

---

## Why Creativity Matters  
It keeps the mind alive and the spirit awake.

> "The world is built by people who refuse to stop imagining."

---

## How to Unlock Creativity  
- Observe everything  
- Capture random thoughts  
- Experiment without fear  
- Collaborate with the curious  

---

## Challenge  
Make one creative output today—however small.

---

## Closing  
Let your ideas breathe.  
Then let them run wild.
  `,
},

{
  id: 15,
  title: "Win Your Hours, Win Your Life",
  synopsis: "Time doesn’t slip away—you give it away.",
  description:
    "Master your hours and you master your trajectory.",
  image: "/images/productivity1.jpeg",
  content: `
## Introduction  
Every chaotic day is a reflection of an unplanned mind.

---

## Why Productivity Matters  
Not because you need to do more—  
but because you need to do what matters.

> "Focus is a superpower."

---

## Practical Systems  
- Time blocking  
- Priority mapping  
- Habit tracking  
- Weekly reviews  

---

## Challenge  
Reclaim one wasted hour today.

---

## Closing  
Your hours are votes.  
Spend them wisely.
  `,
},

{
  id: 16,
  title: "The Mind is a Battlefield",
  synopsis: "Your greatest fights happen in silence.",
  description:
    "Understanding yourself is the first step toward mastering your life.",
  image: "/images/psychology1.jpeg",
  content: `
## Introduction  
The mind is a liar, a healer, a protector, and a destroyer—depending on how you train it.

---

## Why Self-Awareness Matters  
Your thoughts shape your emotions.  
Your emotions shape your actions.  
Your actions shape your life.

> "Master the mind and the world bends with it."

---

## Tools for Mental Strength  
- Journaling  
- Therapy  
- Meditation  
- Pattern awareness  

---

## Reflection  
What belief is holding you hostage?  
Challenge it.

---

## Closing  
The mind obeys the one who listens.
  `,
}

];

export default function Inspiration() {
  return (
    // 💡 APPLIED: pt-16 (Navbar) and pl-4 (Sidebar)
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16 pl-4 pb-10">
        <div className="container mx-auto py-8">
            <h1 className="text-4xl font-extrabold mb-10 text-center bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text flex items-center justify-center">
                <Lightbulb className="w-8 h-8 mr-3 text-purple-600" /> Inspiration Hub
            </h1>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {blogs.map((blog) => (
                    <Card
                        key={blog.id}
                        className="rounded-xl shadow-xl border border-gray-100 dark:border-slate-700 dark:bg-slate-800 
                            hover:shadow-2xl hover:shadow-purple-500/30 hover:scale-[1.02] transition-all duration-300"
                    >
                        {/* Image with hover scale effect */}
                        <div className="h-48 w-full overflow-hidden">
                            <img
                                src={blog.image}
                                alt={blog.title}
                                className="h-full w-full object-cover rounded-t-xl transition-transform duration-500 hover:scale-110"
                            />
                        </div>

                        <CardHeader className="pb-2">
                            <CardTitle className="text-xl font-bold text-gray-900 dark:text-slate-100 line-clamp-2">
                                {blog.title}
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="pt-2">
                            <p className="text-gray-600 dark:text-slate-300 mb-4 line-clamp-3">
                                {blog.description}
                            </p>

                            <Link to={`/inspiration/${blog.id}`}>
                                <Button 
                                    className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold rounded-xl shadow-md shadow-purple-500/30 hover:opacity-90 transition"
                                >
                                    Read and Reflect
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* CTA Button for Creating a Blog */}
            <div className="mt-12 text-center">
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                    Feeling inspired? Start creating your own impactful stories.
                </p>
                <Link to="/auth/login">
                    <Button 
                        className="bg-gradient-to-r from-green-500 to-teal-400 text-white px-10 py-4 rounded-xl shadow-xl shadow-green-500/40 hover:opacity-90 transition-all font-semibold text-lg"
                    >
                        <PenTool className="w-5 h-5 mr-2" /> Start Writing Now
                    </Button>
                </Link>
            </div>
        </div>
    </div>
  );
}