import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-screen flex items-end text-white" style={{backgroundImage: "url('https://images.squarespace-cdn.com/content/v1/5f13a142b2a20e01e9bfd9e3/1653791669541-TDDSOVCWEKVZYEX6T108/unsplash-image-CeYGSLBtuWk.jpg')", backgroundSize:'cover', backgroundPosition:'center'}}>
        <div className="w-full max-w-[1400px] mx-auto p-8">
          <h2 className="text-4xl md:text-6xl font-semibold text-right">Peak Performance Coach</h2>
        </div>
      </section>

      {/* Where Do You Go From Here */}
      <section className="relative py-56" style={{backgroundImage: "url('https://images.squarespace-cdn.com/content/v1/5f13a142b2a20e01e9bfd9e3/1736313453279-VWGAVDGHDBCTQU72PCZT/unsplash-image-vNVwg35VZrg.jpg')", backgroundSize:'cover', backgroundPosition:'center'}}>
        <div className="relative w-full mx-auto p-8">
          <h2 className="text-5xl md:text-8xl text-white text-center font-bold">Where Do You Go From Here?</h2>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-24 bg-light-grey text-default-grey text-4xl">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <h2>You’ve tried things – many things probably, but you’re still in the same place. You know you can achieve more but something is holding you back.</h2>
          <h2>Perhaps what you need is someone who’s been through the same things as you but has found the knowledge, practices, and resources to change.</h2>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 bg-gray-100 text-default-grey">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="text-center text-5xl mb-12">How My Process is Different</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="space-y-4 text-center">
              <img src="https://images.squarespace-cdn.com/content/v1/5f13a142b2a20e01e9bfd9e3/1639877923597-PHIQ98UGANFVSYLKAXC1/unsplash-image-LoGnr-w1D8E.jpg" alt="Identifying" className="w-full h-100 object-cover" />
              <h3 className="text-4xl font-semibold">Identifying Meanings and Beliefs</h3>
              <p className="text-lg">Meanings and beliefs are like the programming language of our life. They provide a filter through which external information and experiences pass.</p>
            </div>
            <div className="space-y-4 text-center">
              <img src="https://images.squarespace-cdn.com/content/v1/5f13a142b2a20e01e9bfd9e3/1639877889055-K1SXB431TORFI5GNSYEL/unsplash-image-8yQijYx5-ww.jpg" alt="Feelings" className="w-full h-100 object-cover" />
              <h3 className="text-4xl font-semibold">Working Through Feelings, Experientially</h3>
              <p className="text-lg">While analyzing the “why” and the “what” around our thoughts and behaviors is useful, behaviors rarely change without working through the feelings.</p>
            </div>
            <div className="space-y-4 text-center">
              <img src="https://images.squarespace-cdn.com/content/v1/5f13a142b2a20e01e9bfd9e3/1639877978633-ACDVU50FKOQZ38FAML6N/unsplash-image-LtHTe32r_nA.jpg" alt="Action" className="w-full h-100 object-cover" />
              <h3 className="text-4xl font-semibold">Taking Consistent, Conscious Action</h3>
              <p className="text-lg">Through identifying beliefs and processing feelings you can enter a new state of consciousness and awareness. This is where true behavioral change happens.</p>
            </div>
          </div>
          <div className="mt-12 text-center">
            <a href="https://link.michaelzick.com/45min" target="_blank" className="btn">Book a Free 45-Minute Strategy Session</a>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      {/* <section className="py-24 bg-gray-800 text-white">
        <div className="max-w-3xl mx-auto space-y-4">
          <h2 className="text-5xl">Subscribe to My Newsletter</h2>
          <h3 className="text-3xl">You’ll receive a FREE Belief Reprogramming Workbook (a $97 value) and early access to free courses. No spam; unsubscribe at any time.</h3>
          <a href="https://link.michaelzick.com/sign-up" target="_blank" className="btn">Subscribe</a>
        </div>
      </section> */}
    </div>
  )
}
