export default function WorkWithMe() {
  return (
    <div className="flex flex-col">
      <section
        className="relative text-white px-6 md:px-8 pt-40 md:pt-56 pb-24 md:pb-32 bg-center bg-cover min-h-[578px]"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        }}
      >
        <div className="max-w-[1400px] mx-auto">
          <h1 className="text-[64px] font-semibold mb-6">Work With Me</h1>
          <h3 className="text-[35px] font-light">
            “You can&apos;t go back and change the beginning, but you can start where you are and change the ending.” — C.S.
            Lewis
          </h3>
        </div>
      </section>
      <section className="px-6 md:px-8 py-24 md:py-32 bg-[var(--light-grey)] text-default-grey">
        <div className="max-w-[1400px] mx-auto space-y-6">
          <h2 className="text-[45px] font-semibold">Individual Coaching Program</h2>
          <h3 className="text-[35px] font-medium">The details:</h3>
          <ul className="list-disc pl-6 space-y-2 text-[23px]">
            <li>
              Work with a certified coach to <strong>significantly improve</strong> your life and relationships
            </li>
            <li>
              <strong>Powerful</strong> homework assignments that dive deep; we’ll leave no stone unturned
            </li>
            <li>
              <strong>Unlimited emails</strong> between sessions (subject to availability)
            </li>
            <li>6-month program to start; variable after that</li>
            <li>Free Belief Reprogramming Workbook</li>
          </ul>
          <div>
            <a
              href="https://link.michaelzick.com/45min"
              target="_blank"
              className="btn mt-6 inline-block"
            >
              Book a Free 45-Minute Strategy Session
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

