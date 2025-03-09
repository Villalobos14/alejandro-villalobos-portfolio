import Monogatari from "../../public/smooth-images/4.png";
import ominio from "../../public/ominiocoer.png";
import nissan from "../../public/nissan.png";
import Fanaticus from "../../public/smooth-images/1.png";
import Goodactions from "../../public/smooth-images/2.png";
import DasoftMock from "../../public/dasoftmock.png"
import Atymockup from "../../public/aty.png"
import Projects from "../components/ui/Projects";
import Heading from "../components/ui/Heading";

export default function Works() {
  return (
    <main className="p-5 md:p-10 xl:p-20 2xl:p-28 bg-primary">
      <section
        className="overflow-hidden"
      >
        <Heading title="Projects" />
        <div className="mt-10 grid grid-cols-1 gap-16 gap-y-10 md:grid-cols-12 text-white">
          <div className=" col-span-1 md:col-span-12">
            <Projects
              link="https://www.figma.com/design/YsON9Kz2hETJjlcWd4i8UZ/hackton2025?node-id=0-1&t=IxgNt15n0ps7gVRH-1"
              img={Monogatari}
              alt="Monogatari website mockup"
              name="Monogatari"
              description="Web3 Platform International Hackathon Winner"
            />
          </div>
          <div className="col-span-1 pt-0 md:col-span-7 md:pt-16">
            <Projects
              link="https://www.figma.com/design/tKdLRGQEh6xPFcYLdROPlT/Ominio-Alejandro-VIllalobos?node-id=2266-18678&t=2W4b1l5b9l3EhVhb-1"
              img={ominio}
              alt="Ominio landing page mockup"
              name="Ominio"
              description="E-Learning Platform - Gamification - AI"
            />
          </div>
          <div className="col-span-1 pt-0 md:col-span-5 md:pt-32">
            <Projects
              link="https://www.figma.com/design/areF0JOlZ4xTkJ9c4bjhVJ/ANDANAC-ALEJANDRO-VILLALOBOS?node-id=0-1&t=YonSVdhgmf8IbvOh-1"
              img={nissan}
              alt="nissan business accountant project mockup"
              name="Andanac"
              description="Intranet redesign for Nissan"
            />
          </div>
          <div className="col-span-1 h-fit pt-0 md:col-span-6 md:pt-20">
            <Projects
              link="https://www.behance.net/gallery/217217671/GOOD-ACTIONS"
              img={Goodactions}
              alt="Good Actions page mockup"
              name="Good Actions"
              description="Web3 / Blockchain Platform - Gamification- Education"
            />
          </div>
          <div className="col-span-1 h-fit md:col-span-5">
            <Projects
              link="https://www.figma.com/design/yGNvRExrZITCpuvjdfRNsy/FANATICUS-ALEJANDRO-VILLALOBOS?node-id=0-1&t=1KVqVn7U2Zga4Lui-1"
              img={Fanaticus}
              alt="Fanaticus project mockup"
              name="Fanaticus"
              description="Baseball Statistics Data Analysis"
            />
          </div>
          <div className="col-span-1 pt-0 md:col-span-7 md:pt-16">
            <Projects
              link="https://www.figma.com/design/o0aDAZt693xMPJicOBpZ23/DASOFT-ALEJANDRO-VILLALOBOS?node-id=2235-237368&t=Dkg8xZ0pdsReyMkH-1"
              img={DasoftMock}
              alt="DasoftMock landing page mockup"
              name="Dasoft"
              description="Project Management Platform"
            />
          </div>
          <div className="col-span-1 pt-0 md:col-span-5 md:pt-32">
            <Projects
              link="https://www.figma.com/design/0F0WevW3dhdkGORIIVwWnv/ATY-PORTFOLIO?node-id=1337-47968&t=M935jwe4SfBdWdoU-1"
              img={Atymockup}
              alt="ATY business accountant project mockup"
              name="ATY"
              description="Drivers's Management Platform Web-Mobile"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
