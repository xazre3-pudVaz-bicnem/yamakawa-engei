/**
 * 最短回答
 *
 * 検索して来た人が、最初の数秒で答えを受け取れるようにするための箱。
 * 各ガイドページの本文のいちばん上に置く。
 * AI検索や強調スニペットに拾われるのも、この短い答えの部分。
 *
 * 長く書かないこと。2〜3文で言い切る。
 */
export default function AnswerBox({
  question,
  children,
}: {
  /** 見出しに相当する質問。例: "ライチの旬はいつ？" */
  question: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-l-2 border-lychee bg-paper-warm px-6 py-6 md:px-8 md:py-7">
      <p className="font-mincho text-[1.02rem] leading-[1.7] text-forest">
        {question}
      </p>
      <div className="mt-3 text-[0.95rem] leading-[2] text-ink/85">
        {children}
      </div>
    </div>
  );
}
