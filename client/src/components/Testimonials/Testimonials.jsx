import { testimonials_list } from "../../data/LandingPage_data/testimonials";

const Testimonials = () => {
  const looped = [...testimonials_list, ...testimonials_list];

  return (
    <section className="bg-[#ff510008] py-20 mt-10">
      <div className="cont grid gap-12">
        <div className="text-center flex flex-col justify-center items-center">
          <h1 className="Normal font-semibold">Reviewed by People</h1>
          <h1 className="Heading font-bold">Client&apos;s Testimonials</h1>
          <p className="Paragraph text-[#8f8e8b] md:w-[50rem] mt-5">
            Discover the positive impact we've made on our clients by reading
            through their testimonials. Our clients have experienced our service
            and results, and they're eager to share their positive experiences
            with you.
          </p>
        </div>

        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-20 z-10 bg-gradient-to-r from-[#ff510008] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-20 z-10 bg-gradient-to-l from-[#ff510008] to-transparent" />

          <div className="group">
            <ul
              className="
                flex w-[max-content] gap-8
                animate-[carousel_30s_linear_infinite]
                group-hover:[animation-play-state:paused]
                group-hover:[cursor:pointer]
                will-change-transform
              "
            >
              {looped.map((item, idx) => (
                <li key={idx} className="w-[420px] shrink-0">
                  <article className="grid feedback-card border border-[#b0ada958] shadowPrim p-6 gap-6 bg-white/70 backdrop-blur-sm h-[450px] overflow-hidden">
                    <p
                      className="
                        Normal font-[500]
                        overflow-y-auto max-h-[150px]
                        no-scrollbar"
                    >
                      {item.testimony}
                    </p>

                    <div className="flex items-center gap-5">
                      <img
                        src={item.image_path}
                        className="rounded-[50%] w-[70px] h-[70px] object-cover"
                        alt={item?.name || "Client"}
                        loading="lazy"
                      />
                      <div>
                        {item?.name && (
                          <h1 className="font-bold Normal">{item.name}</h1>
                        )}
                        {item?.location && (
                          <h1 className="Normal">{item.location}</h1>
                        )}
                      </div>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
