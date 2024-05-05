import { Header } from '@/components/header';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const accordionData = [
  {
    title: 'What is LogiCola?',
    content: `LogiCola is an instructional program that goes with Gensler's Introduction to Logic (Routledge Press). Since Harry Gensler, the original creator has passed away, I decided to create a new version to preserve an important learning resource and honour his legacy.`,
  },
  {
    title: 'Do I have to pay anything to use it?',
    content:
      'This version of the software is open sourced and access to the learning content is and will always remain 100% free. With that in mind, any contribution can help keep the platform running and accelerate the process of adding content and exercises.',
  },
  {
    title: "What's the difference between this and the original software?",
    content:
      'This version of LogiCola is a remake of the original, built with web software. You can use it in any device that has an internet connection, regardless of the operating system. It only has a couple of months, so, most chapters and exercises are missing.',
  },
  {
    title: 'Is there also a new version of Logiskor?',
    content:
      "LogiSkor is a program for keeping track of student scores from LogiCola. I'm working on a way to let you see how your students are doing and to support your classroom. Please email me if you're interested in giving it a try.",
  },
];

export default function Home() {
  return (
    <>
      <div className='flex flex-col m-auto'>
        <Header />

        <section className='py-8 px-4 w-full max-w-screen-xl mx-auto'>
          <h1 className='text-center mb-10 text-3xl font-bold tracking-tight leading-none text-gray-800 md:text-3xl lg:text-3xl font-stretch'>
            Frequently Asked Questions
          </h1>
          <Accordion className='text-gray-800 text-lg' type='multiple'>
            {accordionData.map((item) => (
              <AccordionItem value={item.title} key={item.title}>
                <AccordionTrigger>{item.title}</AccordionTrigger>
                <AccordionContent className='text-lg text-gray-500'>
                  {item.content}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      </div>
    </>
  );
}
