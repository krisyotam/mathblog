import Link from 'next/link'
import { CommandMenu } from '@/components/command-menu'

export default function DemoPostPage() {
  return (
    <main className="min-h-screen px-4 py-8 bg-white text-black dark:bg-black dark:text-white">
      <nav className="max-w-2xl mx-auto mb-16">
        <div className="flex items-center space-x-1 text-sm font-mono">
          <Link href="/" className="text-gray-500 dark:text-gray-400">@krisyotam</Link>
          <span className="text-gray-500 dark:text-gray-400">/</span>
          <Link href="/blog" className="hover:text-gray-600 dark:hover:text-gray-300">Blog</Link>
          <span className="text-gray-500 dark:text-gray-400">/</span>
          <span className="text-gray-600 dark:text-gray-300">Demo Post</span>
        </div>
      </nav>

      <article className="max-w-2xl mx-auto prose prose-sm dark:prose-invert">
        <h1 className="text-2xl font-bold mb-4">Exploring Advanced Mathematical Concepts</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Published on May 15, 2023</p>

        <p>
          In this comprehensive exploration of advanced mathematical concepts, we'll delve into various topics ranging from complex analysis to algebraic topology. Our journey will take us through intricate formulas, theoretical frameworks, and practical applications.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">1. The Cauchy-Gauss Formula</h2>
        <p>
          Let's begin with an examination of the Cauchy-Gauss formula, a powerful tool in complex analysis. This formula demonstrates the intricate relationship between multidimensional integrals and infinite series:
        </p>

        <div className="my-8 overflow-x-auto">
          <math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
            <mrow>
              <munderover>
                <mo>∑</mo>
                <mrow><mi>n</mi><mo>=</mo><mn>1</mn></mrow>
                <mo>∞</mo>
              </munderover>
              <msubsup>
                <mo>∫</mo>
                <mn>0</mn>
                <mo>∞</mo>
              </msubsup>
              <mrow>
                <mo>(</mo>
                <munderover>
                  <mo>∏</mo>
                  <mrow><mi>k</mi><mo>=</mo><mn>1</mn></mrow>
                  <mi>n</mi>
                </munderover>
                <mrow>
                  <mo>(</mo>
                  <mfrac>
                    <msup>
                      <mo>∂</mo>
                      <mn>2</mn>
                    </msup>
                    <mrow>
                      <mo>∂</mo>
                      <msubsup>
                        <mi>x</mi>
                        <mi>k</mi>
                        <mn>2</mn>
                      </msubsup>
                    </mrow>
                  </mfrac>
                  <msup>
                    <mi>e</mi>
                    <mrow>
                      <mo>-</mo>
                      <munderover>
                        <mo>∑</mo>
                        <mrow><mi>i</mi><mo>=</mo><mn>1</mn></mrow>
                        <mi>n</mi>
                      </munderover>
                      <msubsup>
                        <mi>x</mi>
                        <mi>i</mi>
                        <mn>2</mn>
                      </msubsup>
                    </mrow>
                  </msup>
                  <mo>)</mo>
                </mrow>
              </mrow>
              <mo>)</mo>
              <mspace width="0.2em" />
              <mi>d</mi>
              <msub>
                <mi>x</mi>
                <mn>1</mn>
              </msub>
              <mspace width="0.2em" />
              <mi>d</mi>
              <msub>
                <mi>x</mi>
                <mn>2</mn>
              </msub>
              <mo>⋯</mo>
              <mi>d</mi>
              <msub>
                <mi>x</mi>
                <mi>n</mi>
              </msub>
            </mrow>
            <mo>=</mo>
            <mfrac>
              <mn>1</mn>
              <msqrt>
                <mi>π</mi>
              </msqrt>
            </mfrac>
            <munderover>
              <mo>∑</mo>
              <mrow><mi>k</mi><mo>=</mo><mn>1</mn></mrow>
              <mi>n</mi>
            </munderover>
            <mrow>
              <mo>(</mo>
              <msubsup>
                <mo>∫</mo>
                <mn>0</mn>
                <mo>∞</mo>
              </msubsup>
              <msup>
                <mi>e</mi>
                <mrow>
                  <mo>-</mo>
                  <msubsup>
                    <mi>x</mi>
                    <mi>k</mi>
                    <mn>2</mn>
                  </msubsup>
                </mrow>
              </msup>
              <mspace width="0.2em" />
              <mi>d</mi>
              <msub>
                <mi>x</mi>
                <mi>k</mi>
              </msub>
              <mo>)</mo>
            </mrow>
            <mo>×</mo>
            <mrow>
              <mo>[</mo>
              <mi mathvariant="bold">A</mi>
              <mo>⋅</mo>
              <mi mathvariant="bold">B</mi>
              <msub>
                <mo>]</mo>
                <mrow><mi>n</mi><mo>×</mo><mi>n</mi></mrow>
              </msub>
            </mrow>
            <mo>⋅</mo>
            <mrow>
              <mo>(</mo>
              <munderover>
                <mo>∑</mo>
                <mrow><mi>m</mi><mo>=</mo><mn>1</mn></mrow>
                <mi>n</mi>
              </munderover>
              <mfrac>
                <mn>1</mn>
                <msup>
                  <mi>m</mi>
                  <mn>2</mn>
                </msup>
              </mfrac>
              <mo>)</mo>
            </mrow>
          </math>
        </div>

        <p>
          This formula encapsulates the intricate relationship between multidimensional integrals and infinite series. It serves as a cornerstone in various fields of mathematics and physics, particularly in quantum mechanics and statistical physics.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">2. Riemann Hypothesis and Zeta Function</h2>
        <p>
          The Riemann Hypothesis, one of the most famous unsolved problems in mathematics, is intimately connected to the Riemann zeta function. The zeta function is defined for complex s with real part greater than 1 by the absolutely convergent infinite series:
        </p>

        <div className="my-8 overflow-x-auto">
          <math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
            <mrow>
              <mi>ζ</mi>
              <mo>(</mo>
              <mi>s</mi>
              <mo>)</mo>
              <mo>=</mo>
              <munderover>
                <mo>∑</mo>
                <mrow><mi>n</mi><mo>=</mo><mn>1</mn></mrow>
                <mo>∞</mo>
              </munderover>
              <mfrac>
                <mn>1</mn>
                <msup>
                  <mi>n</mi>
                  <mi>s</mi>
                </msup>
              </mfrac>
            </mrow>
          </math>
        </div>

        <p>
          The Riemann Hypothesis states that the non-trivial zeros of the zeta function all have real part equal to 1/2. This seemingly simple statement has profound implications in number theory and beyond.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">3. Yoneda Lemma in Category Theory</h2>
        <p>
          In category theory, the Yoneda lemma is a fundamental result that relates any object A of a locally small category C to the contravariant functor Hom(−, A) : C → Set. It can be stated as follows:
        </p>

        <div className="my-8 overflow-x-auto">
          <math xmlns="http://www.w3.org/1998/Math/MathML" display="block">
            <mrow>
              <mi>Nat</mi>
              <mo>(</mo>
              <mi>Hom</mi>
              <mo>(</mo>
              <mo>−</mo>
              <mo>,</mo>
              <mi>A</mi>
              <mo>)</mo>
              <mo>,</mo>
              <mi>F</mi>
              <mo>)</mo>
              <mo>≅</mo>
              <mi>F</mi>
              <mo>(</mo>
              <mi>A</mi>
              <mo>)</mo>
            </mrow>
          </math>
        </div>

        <p>
          This lemma essentially states that an object in a category is completely determined by its relationships to other objects, as encoded by the homomorphisms to it.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-4">Conclusion</h2>
        <p>
          These advanced mathematical concepts demonstrate the depth and complexity of modern mathematics. From the intricate Cauchy-Gauss formula to the far-reaching implications of the Riemann Hypothesis and the abstract power of category theory, mathematics continues to provide us with powerful tools for understanding the universe and solving complex problems.
        </p>

        <p>
          As we continue to explore these concepts, we open new avenues for research and application in fields ranging from pure mathematics to theoretical physics and beyond.
        </p>
      </article>

      <CommandMenu />
    </main>
  )
}

