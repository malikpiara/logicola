import { Card, CardContent } from '@/components/ui/card';
import Head from 'next/head';

export default function SyllogisticLogicPage() {
  return (
    <>
      <Head>
        <title>Syllogistic Translations – A Quick Guide</title>
        <meta
          name='description'
          content='A concise overview of Syllogistic Translations, including basic and harder examples.'
        />
      </Head>
      <div className='container mx-auto py-8 space-y-8 max-w-4xl animate-in'>
        <h1 className='text-3xl font-bold mb-6 text-black'>
          Syllogistic Translations
        </h1>

        {/* --------------------- Easier Translations ---------------------- */}
        <section className='space-y-6'>
          <h2 className='text-2xl font-semibold text-black'>
            Easier Translations
          </h2>

          <Card>
            <CardContent className='pt-6'>
              <p className='text-lg leading-relaxed mb-6'>
                Syllogistic logic studies arguments whose validity depends on
                &quot;all,&quot; &quot;no,&quot; &quot;some,&quot; and similar
                notions. In symbolizing such arguments, we use capital letters
                for general categories (like &quot;logician&quot;) and small
                letters for specific individuals (like &quot;Gensler&quot;).
              </p>

              <div className='my-6'>
                {/* Basic forms of well-formed formulas (unchanged design) */}
                <div className='border border-gray-200 rounded-md overflow-hidden'>
                  <ul className='divide-y divide-gray-200'>
                    <li className='px-4 py-2'>all A is B</li>
                    <li className='px-4 py-2'>no A is B</li>
                    <li className='px-4 py-2'>some A is B</li>
                    <li className='px-4 py-2'>some A is not B</li>
                    <li className='px-4 py-2'>x is A</li>
                    <li className='px-4 py-2'>x is not A</li>
                    <li className='px-4 py-2'>x is y</li>
                    <li className='px-4 py-2'>x is not y</li>
                  </ul>
                </div>
              </div>

              <div className='space-y-4'>
                <h3 className='text-xl font-semibold'>Important Rules:</h3>
                <ul className='list-disc pl-6 space-y-2'>
                  <li>
                    Use capital letters for general terms (terms that describe
                    or put in a category)
                    <ul className='list-disc pl-6 mt-2 text-muted-foreground'>
                      <li>
                        Examples: &quot;a cute baby&quot;, &quot;charming&quot;,
                        &quot;drives a Buick&quot;
                      </li>
                    </ul>
                  </li>
                  <li>
                    Use small letters for singular terms (terms that pick out a
                    specific person or thing)
                    <ul className='list-disc pl-6 mt-2 text-muted-foreground'>
                      <li>
                        Examples: &quot;the world&apos;s cutest baby&quot;,
                        &quot;this child&quot;, &quot;David&quot;
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>

              <div className='mt-6 p-4 bg-muted rounded-lg'>
                <h4 className='font-semibold mb-2'>
                  Examples of correct translations:
                </h4>
                <ul className='space-y-2'>
                  <li>All babies are cute = all B is C</li>
                  <li>Will Gensler is a baby = w is B</li>
                  <li>Will Gensler is the world&apos;s cutest baby = w is b</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* --------------------- Harder Translations ---------------------- */}
        <section className='space-y-6'>
          <h2 className='text-2xl font-semibold text-black'>
            Harder Translations
          </h2>

          <Card>
            <CardContent className='pt-6'>
              <p className='text-lg leading-relaxed mb-6'>
                English has various idiomatic ways to express our wffs. Instead
                of &quot;all&quot; we can say &quot;any,&quot; &quot;each,&quot;
                &quot;every,&quot; or &quot;whoever.&quot;
              </p>

              {/* Redesigned to mimic the side-by-side style without bright colors */}
              <div className='my-6 border border-gray-200 rounded-md overflow-hidden'>
                {/* 2x2 layout on larger screens; stacked on smaller screens */}
                <div className='grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200'>
                  {/* all A is B */}
                  <div className='p-4'>
                    <h4 className='font-semibold mb-2'>all A is B =</h4>
                    <ul className='list-disc pl-6 space-y-1'>
                      <li>A&apos;s are B&apos;s</li>
                      <li>Those who are A are B</li>
                      <li>If a person is A, then she is B</li>
                      <li>If you&apos;re A, then you&apos;re B</li>
                      <li>Only B&apos;s are A&apos;s</li>
                      <li>None but B&apos;s are A&apos;s</li>
                      <li>No one is A unless she is B</li>
                      <li>Nothing is A unless it&apos;s B</li>
                      <li>A thing isn&apos;t A unless it&apos;s B</li>
                      <li>It&apos;s false that some A is not B</li>
                    </ul>
                  </div>

                  {/* no A is B */}
                  <div className='p-4 border-t md:border-t-0'>
                    <h4 className='font-semibold mb-2'>
                      no A is B = no B is A =
                    </h4>
                    <ul className='list-disc pl-6 space-y-1'>
                      <li>A&apos;s aren&apos;t B&apos;s</li>
                      <li>Every (each, any) A is non-B</li>
                      <li>Whoever (whatever) is A isn&apos;t B</li>
                      <li>Those who are A aren&apos;t B</li>
                      <li>If a person is A, then she isn&apos;t B</li>
                      <li>If you&apos;re A, then you aren&apos;t B</li>
                      <li>There isn&apos;t a single A that&apos;s B</li>
                      <li>Not any A is B</li>
                      <li>
                        It&apos;s false that there&apos;s an A that&apos;s B
                      </li>
                      <li>It&apos;s false that some A is B</li>
                    </ul>
                  </div>

                  {/* some A is B */}
                  <div className='p-4 border-t'>
                    <h4 className='font-semibold mb-2'>
                      some A is B = some B is A =
                    </h4>
                    <ul className='list-disc pl-6 space-y-1'>
                      <li>One or more A&apos;s are B&apos;s</li>
                      <li>A&apos;s are sometimes B&apos;s</li>
                      <li>It&apos;s false that no A is B</li>
                    </ul>
                  </div>

                  {/* some A is not B */}
                  <div className='p-4 border-t md:border-l'>
                    <h4 className='font-semibold mb-2'>some A is not B =</h4>
                    <ul className='list-disc pl-6 space-y-1'>
                      <li>One or more A&apos;s aren&apos;t B&apos;s</li>
                      <li>Not all A&apos;s are B&apos;s</li>
                      <li>It&apos;s false that all A is B</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className='mt-6 p-4 bg-muted rounded-lg'>
                <h4 className='font-semibold mb-2'>
                  Examples of correct translations:
                </h4>
                <ul className='space-y-2'>
                  <li>Snakes aren&apos;t furry = no S is F</li>
                  <li>Only men are football players = all F is M</li>
                  <li>Not all steaks are well done = some S is not W</li>
                </ul>
              </div>

              <div className='mt-6'>
                <p className='text-muted-foreground italic'>
                  When you translate from English to logic, be careful to use
                  correct WFFs.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </>
  );
}
