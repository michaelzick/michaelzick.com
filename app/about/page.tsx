export default function About() {
  return (
    <div className="flex flex-col">
      <section
        className="relative text-white px-6 md:px-8 pt-40 md:pt-56 pb-24 md:pb-32 bg-center bg-cover"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        }}
      >
        <div className="max-w-[1400px] mx-auto">
          <h1 className="text-[64px] font-semibold mb-6">About</h1>
          <h3 className="text-[35px] font-light">
            “Mental health is a commitment to reality at all costs.” — M. Scott Peck
          </h3>
        </div>
      </section>

      <section className="px-6 md:px-8 py-24 md:py-32 bg-[var(--light-grey)] text-default-grey">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-center gap-8">
            <div className="md:w-1/2 space-y-6 order-2 md:order-1">
              <h2 className="text-[45px] font-semibold">Michael is all about action.</h2>
              <p className="text-[23px]">
                He stands by the phrase, &quot;We don&apos;t think our way into right action; we act our
                way into right thinking.&quot; In other words, replacing worrying with doing is the
                path to success that Michael encourages, and his clients have the results to show
                for it.
              </p>
              <p className="text-[23px]">
                He has worked with the best of the best — from top business and marketing
                coaches to world-renowned relationship experts like Dr. Glover and Erwan and
                Alicia Davon.
              </p>
              <p className="text-[23px]">
                With his no-BS approach, those who work with Michael will know what it&apos;s like to
                replace rumination with action, take ownership of their thoughts, feelings, and
                behaviors, stop being a victim, and play well with others without being &quot;nice.&quot;
              </p>
            </div>
            <div className="md:w-1/2 order-1 md:order-2">
              <img
                src="https://images.squarespace-cdn.com/content/v1/5f13a142b2a20e01e9bfd9e3/c328a4db-a4b7-436d-ba24-1222051310e5/DSC03651.jpg"
                alt="Michael wearing a jacket"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-8 py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-center gap-8">
            <div className="md:w-1/2">
              <img
                src="https://images.squarespace-cdn.com/content/v1/5f13a142b2a20e01e9bfd9e3/1633647108612-3VE4IJDM88VBYCF0MVKR/MichaelSuitHotel%2522Driplinell%2522-0333.jpg"
                alt="Michael in suit"
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="md:w-1/2 space-y-6">
              <p className="text-[23px]">
                Michael has successfully coached celebrities, entrepreneurs, Nice Guys, and men
                and women through various transitions. Is it time for your life to change for the
                better?
              </p>
              <h2 className="text-[45px] font-semibold">Let’s talk.</h2>
              <a
                href="https://link.michaelzick.com/45min"
                target="_blank"
                className="btn inline-block"
              >
                Book a Free 45-Minute Strategy Session
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 md:px-8 py-24 md:py-32 bg-[var(--light-grey)] text-default-grey">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="space-y-4">
              <h3 className="text-[35px] font-medium">
                Certified as a Life &amp; Relationship Coach by Life Purpose Institute.
              </h3>
              <h3 className="text-[35px] font-medium">
                Certified by Dr. Robert Glover, author of “No More Mr. Nice Guy” and renowned
                therapist.
              </h3>
              <h3 className="text-[35px] font-medium">
                Established in the Los Angeles mental health and recovery community since 2015.
              </h3>
              <a
                href="https://link.michaelzick.com/45min"
                target="_blank"
                className="btn inline-block mt-6"
              >
                Book a Free 45-Minute Strategy Session
              </a>
            </div>
            <div className="space-y-4">
              <h2 className="text-[45px] font-semibold">Specialties:</h2>
              <ul className="list-disc pl-6 space-y-2 text-[23px]">
                <li>Nice Guy Syndrome</li>
                <li>Relationships &amp; dating</li>
                <li>Finding your purpose</li>
                <li>Codependency</li>
                <li>Belief reprogramming</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

