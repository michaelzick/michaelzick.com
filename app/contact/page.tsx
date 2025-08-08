export default function Contact() {
  return (
    <div className="bg-[var(--dark-blue)] text-white min-h-full px-6 md:px-8 pt-40 md:pt-56 pb-24 md:pb-32">
      <div className="max-w-[1400px] mx-auto grid md:grid-cols-12 gap-8">
        <div className="md:col-span-5 space-y-6">
          <h1 className="text-[64px] font-semibold">Contact</h1>
          <div className="flex space-x-4">
            <a
              href="https://michaelzick.medium.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Medium"
            >
              <svg
                className="w-8 h-8 fill-current"
                viewBox="0 0 64 64"
                aria-hidden="true"
              >
                <path d="M46.908,23.95c-0.006-0.005-0.011-0.01-0.018-0.014l-0.01-0.005l-9.05-4.525c-0.061-0.031-0.125-0.051-0.19-0.068c-0.082-0.021-0.165-0.034-0.249-0.034c-0.347,0-0.692,0.174-0.878,0.477l-5.21,8.467l6.538,10.625l9.095-14.779C46.966,24.046,46.952,23.985,46.908,23.95z M28.433,35.958L37,40.241L28.433,26.32V35.958z M38.287,40.884l7.052,3.526C46.256,44.869,47,44.548,47,43.693V26.726L38.287,40.884z M26.946,23.964l-8.839-4.419c-0.16-0.08-0.312-0.118-0.449-0.118c-0.387,0-0.659,0.299-0.659,0.802v19.083c0,0.511,0.374,1.116,0.831,1.344l7.785,3.892c0.2,0.1,0.39,0.147,0.561,0.147c0.484,0,0.823-0.374,0.823-1.003V24.051C27,24.014,26.979,23.98,26.946,23.964z" />
              </svg>
            </a>
          </div>
        </div>
        <div className="md:col-span-6">
          <form className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="first-name" className="block mb-1">
                    First Name
                  </label>
                  <input
                    id="first-name"
                    type="text"
                    className="w-full border border-gray-300 p-2 text-black bg-white"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="last-name" className="block mb-1">
                    Last Name
                  </label>
                  <input
                    id="last-name"
                    type="text"
                    className="w-full border border-gray-300 p-2 text-black bg-white"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="w-full border border-gray-300 p-2 text-black bg-white"
                  required
                />
              </div>
              <div>
                <label htmlFor="message" className="block mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  className="w-full border border-gray-300 p-2 text-black bg-white"
                  rows={4}
                  required
                ></textarea>
              </div>
              <button type="submit" className="btn">
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

