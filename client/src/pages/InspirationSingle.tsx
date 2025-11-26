// src/pages/InspirationSingle.tsx
import { useParams } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const blogs = [
  {
    id: 1,
    title: "The Quiet Power of Showing Up",
    synopsis: "Greatness isn’t born in noise—it’s forged in consistency.",
    description:
      "Small steps compound into momentum. Momentum compounds into transformation.",
    image: "/images/inspire1.jpg",
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
    image: "/images/inspire2.jpg",
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
    image: "/images/inspire3.jpg",
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
    image: "/images/inspire4.jpg",
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
    image: "/images/inspire5.jpg",
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
    image: "/images/inspire6.jpg",
    content: `
      Protect your peace as though it's the crown jewel of your kingdom.
      Let no thought enter unchallenged. Let no fear reign unchecked.
      Rule your mind with intentionality—and your life becomes a masterpiece.
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
    </div>
  );
}
