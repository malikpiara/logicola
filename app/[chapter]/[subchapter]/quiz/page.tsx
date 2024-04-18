'use client';
import NoSSR from '@/components/NoSSR';
import QuestionComponent from '@/components/question/question';
import { EndScreen } from '@/components/quiz/endScreen';
import { StartScreen } from '@/components/quiz/startScreen';
import { content } from '@/content';
import { shuffleArray } from '@/lib/utils';
import type { Question } from '@/types';
import { useState } from 'react';

const take10RandomQuestions = (questions: Question[]) =>
  shuffleArray(questions).slice(0, 10);

export default function QuizPage({
  params: { chapter: chapterSlug, subchapter: subChapterSlug },
}: {
  params: { chapter: string; subchapter: string };
}) {
  const [isStartScreen, setIsStartScreen] = useState(true);
  const [isEndScreen, setIsEndScreen] = useState(false);

  const chapter = content.chapters[chapterSlug];
  const subChapter = chapter.subChapters[subChapterSlug];

  const [showSolution, setShowSolution] = useState(false);
  const [questions, setQuestions] = useState<Question[]>(
    take10RandomQuestions(subChapter.questions)
  );

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [score, setScore] = useState(0);

  const nextQuestionButton = (
    <button
      disabled={!showSolution}
      className='text-green-600 rounded-lg text-sm font-semibold px-5 py-2.5 me-2 mb-2 border border-green-600 hover:opacity-90 disabled:border-gray-300 disabled:text-gray-300 disabled:cursor-not-allowed'
      onClick={() => {
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          setSelectedOptionIndices(new Set());
          setShowSolution(false);
        } else {
          setIsEndScreen(true);
        }
      }}
    >
      {currentQuestionIndex < questions.length - 1 ? 'Next' : 'Done'}
    </button>
  );

  const [selectedOptionIndices, setSelectedOptionIndices] = useState<
    Set<number>
  >(new Set());

  if (isStartScreen) {
    return (
      <StartScreen
        onClickStart={() => setIsStartScreen(false)}
        questionsCount={questions.length}
      />
    );
  }

  if (isEndScreen) {
    return (
      <EndScreen
        correctQuestionsCount={score}
        totalQuestionsCount={questions.length}
        onClickTryAgain={() => {
          setIsEndScreen(false);
          setCurrentQuestionIndex(0);
          setScore(0);
          setSelectedOptionIndices(new Set());
          setShowSolution(false);
          setQuestions(take10RandomQuestions(subChapter.questions));
        }}
      />
    );
  }

  return (
    <>
      <div className='flex w-full h-full overflow-scroll'>
        <div className='p-4 w-full'>
          <h1 className='mb-6 text-3xl font-bold text-gray-900'>
            {subChapter.title}
          </h1>
          <NoSSR>
            <QuestionComponent
              question={questions[currentQuestionIndex]}
              questionIndexToShow={currentQuestionIndex}
              nextQuestionButton={nextQuestionButton}
              randomizeOptions={subChapter.randomizeQuestions}
              selectedOptionIndices={selectedOptionIndices}
              setSelectedOptionIndices={setSelectedOptionIndices}
              showSolution={showSolution}
              onAnswerCheck={(isCorrect) => {
                setShowSolution(true);
                if (isCorrect) {
                  setScore(score + 1);
                }
              }}
              scoreboard={
                <div className='text-gray-900 font-semibold'>
                  Score: {score} / {questions.length}
                </div>
              }
            />
          </NoSSR>
        </div>
      </div>
    </>
  );
}
