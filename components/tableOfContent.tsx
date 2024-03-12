import Link from 'next/link';

type TableOfContentProps = {
  chapter: number;
};

const TableOfContent = ({ chapter }: TableOfContentProps) => {
  return (
    <div className='max-w-7xl p-6 bg-white border border-stone-200 rounded-lg mb-6'>
      {chapter === 6 ? (
        <>
          <Link href='/logicola/logic/basic-propositional-logic/'>
            <h3 className='mb-2 text-xl font-bold tracking-tight text-stone-900 hover:text-primary'>
              Chapter 6: Basic Propositional Logic
            </h3>
          </Link>
          <hr className='h-px my-4 bg-stone-200 border-0'></hr>
          <div className='mx-auto w-full max-w-screen-xl p-4'>
            <div className='md:flex md:justify-between'>
              <div className='grid grid-cols-2 sm:gap-72 sm:grid-cols-2 w-11/12'>
                <div>
                  <ul className='text-stone-600 font-medium'>
                    <Link
                      href='/logicola/logic/basic-propositional-logic'
                      className='hover:bg-stone-200'
                    >
                      <li className='mb-1 hover:bg-stone-200 p-3 rounded-md'>
                        Easier Translations
                      </li>
                    </Link>
                    <li className='mb-1 p-3 rounded-md'>
                      <Link href='#' className='opacity-30 cursor-not-allowed'>
                        Simple Truth Tables
                      </Link>
                    </li>
                    <li className='mb-1 p-3 rounded-md'>
                      <Link href='#' className='opacity-30 cursor-not-allowed'>
                        Truth Evaluations
                      </Link>
                    </li>
                    <li className='mb-1 p-3 rounded-md'>
                      <Link href='#' className='opacity-30 cursor-not-allowed'>
                        Unknown Truth Evaluations
                      </Link>
                    </li>
                    <li className='mb-1 p-3 rounded-md'>
                      <Link href='#' className='opacity-30 cursor-not-allowed'>
                        Complex Truth Tables
                      </Link>
                    </li>
                    <li className='mb-1 p-3 rounded-md'>
                      <Link href='#' className='opacity-30 cursor-not-allowed'>
                        The Truth-table Test
                      </Link>
                    </li>
                    <li className='mb-1 p-3 rounded-md'>
                      <Link href='#' className='opacity-30 cursor-not-allowed'>
                        The Truth-assignment Test
                      </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <ul className='text-stone-500 font-medium'>
                    <li className='mb-1 hover:bg-stone-200 p-3 rounded-md'>
                      <Link href='/logicola/logic/basic-propositional-logic'>
                        Harder Translations
                      </Link>
                    </li>
                    <li className='mb-1 hover:bg-stone-200 p-3 rounded-md'>
                      <Link href='#' className='opacity-30 cursor-not-allowed'>
                        Idiomatic Arguments
                      </Link>
                    </li>
                    <li className='mb-1 hover:bg-stone-200 p-3 rounded-md'>
                      <Link href='#' className='opacity-30 cursor-not-allowed'>
                        S-Rules
                      </Link>
                    </li>
                    <li className='mb-1 hover:bg-stone-200 p-3 rounded-md'>
                      <Link href='#' className='opacity-30 cursor-not-allowed'>
                        I-Rules
                      </Link>
                    </li>
                    <li className='mb-1 hover:bg-stone-200 p-3 rounded-md'>
                      <Link href='#' className='opacity-30 cursor-not-allowed'>
                        Mixing S- and I-Rules
                      </Link>
                    </li>
                    <li className='mb-1 hover:bg-stone-200 p-3 rounded-md'>
                      <Link href='#' className='opacity-30 cursor-not-allowed'>
                        Extended Inferences
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <h3 className='mb-2 text-xl font-bold tracking-tight text-stone-900 opacity-30 cursor-not-allowed'>
            Chapter 7: Propositional Proofs
          </h3>
          <hr className='h-px my-4 bg-stone-200 border-0'></hr>
          <div className='mx-auto w-full max-w-screen-xl p-4'>
            <div className='md:flex md:justify-between'>
              <div className='grid grid-cols-2 sm:gap-72 sm:grid-cols-2'>
                <div>
                  <ul className='text-stone-500 font-medium'>
                    <li className='mb-1 hover:bg-stone-200 p-3 rounded-md'>
                      <Link href='#' className='opacity-30 cursor-not-allowed'>
                        Easier Proofs
                      </Link>
                    </li>
                    <li className='mb-1 hover:bg-stone-200 p-3 rounded-md'>
                      <Link href='#' className='opacity-30 cursor-not-allowed'>
                        Easier Refutations
                      </Link>
                    </li>
                    <li className='mb-1 hover:bg-stone-200 p-3 rounded-md'>
                      <Link href='#' className='opacity-30 cursor-not-allowed'>
                        Harder Proofs
                      </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <ul className='text-stone-500 font-medium'>
                    <li className='mb-1 hover:bg-stone-200 p-3 rounded-md'>
                      <Link href='#' className='opacity-30 cursor-not-allowed'>
                        Harder Refutations
                      </Link>
                    </li>
                    <li className='mb-1 hover:bg-stone-200 p-3 rounded-md'>
                      <Link href='#' className='opacity-30 cursor-not-allowed'>
                        Other Proof Methods
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TableOfContent;
