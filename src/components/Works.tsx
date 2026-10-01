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
    <main className="w-full bg-primary px-[var(--page-gutter)] py-5 md:py-10">
      <section
        className="overflow-hidden"
      >
        <Heading title="Projects" />
        <div className="mt-10 grid grid-cols-1 gap-16 gap-y-10 md:grid-cols-12 text-white">
          <div className=" col-span-1 md:col-span-12">
            <Projects
              link="/work/mlstoolbox"
              img={Monogatari}
              alt="Two Monogatari manga-reader screens: a light landing page reading \"Discover unique stories anytime\" over manga panel art, and a dark catalogue page with a best-sellers row of cover thumbnails"
              name="Ominio"
              description="Elearning platform"
            />
          </div>
          <div className="col-span-1 pt-0 md:col-span-7 md:pt-16">
            <Projects
              link="https://www.figma.com/design/tKdLRGQEh6xPFcYLdROPlT/Ominio-Alejandro-VIllalobos?node-id=2266-18678&t=2W4b1l5b9l3EhVhb-1"
              img={ominio}
              alt="Three Ominio phone screens: a green splash screen, an \"Interview Ready\" page offering 5 to 30 minute mock interview sessions, and a home screen with a level badge, a 21-day streak and weekly progress figures"
              name="Ominio"
              description="E-Learning Platform - Gamification - AI"
            />
          </div>
          <div className="col-span-1 pt-0 md:col-span-5 md:pt-32">
            <Projects
              link="https://www.figma.com/design/areF0JOlZ4xTkJ9c4bjhVJ/ANDANAC-ALEJANDRO-VILLALOBOS?node-id=0-1&t=YonSVdhgmf8IbvOh-1"
              img={nissan}
              alt="Andanac web page for Nissan headed \"Nissan presenta Xtremer\" over a close-up of an X-Trail headlight, with a banner reading \"16 años siendo líderes en la industria automotriz\""
              name="Andanac"
              description="Intranet redesign for Nissan"
            />
          </div>
          <div className="col-span-1 h-fit pt-0 md:col-span-6 md:pt-20">
            <Projects
              link="https://www.behance.net/gallery/217217671/GOOD-ACTIONS"
              img={Goodactions}
              alt="Two Good Actions screens: a landing page headed \"Transforming education with GoodActions\" with a sign-up-with-wallet button, and a dark profile page showing a token wallet balance and a transaction list"
              name="Good Actions"
              description="Web3 / Blockchain Platform - Gamification- Education"
            />
          </div>
          <div className="col-span-1 h-fit md:col-span-5">
            <Projects
              link="https://www.figma.com/design/yGNvRExrZITCpuvjdfRNsy/FANATICUS-ALEJANDRO-VILLALOBOS?node-id=0-1&t=1KVqVn7U2Zga4Lui-1"
              img={Fanaticus}
              alt="Two Fanaticus phone screens in Spanish: a Shohei Ohtani player profile with his pitching statistics, and a Los Angeles Dodgers page with a radar chart of OBP, SLG and OPS above a hit-average plot"
              name="Fanaticus"
              description="Baseball Statistics Data Analysis"
            />
          </div>
          <div className="col-span-1 pt-0 md:col-span-7 md:pt-16">
            <Projects
              link="https://www.figma.com/design/o0aDAZt693xMPJicOBpZ23/DASOFT-ALEJANDRO-VILLALOBOS?node-id=2235-237368&t=Dkg8xZ0pdsReyMkH-1"
              img={DasoftMock}
              alt="Two Dasoft admin screens in Spanish: a Tecnologías page listing HTML, CSS, JavaScript and other technologies with collaborator counts, and a Volkswagen Mexico client record listing collaborators with their rates and roles"
              name="Dasoft"
              description="Project Management Platform"
            />
          </div>
          <div className="col-span-1 pt-0 md:col-span-5 md:pt-32">
            <Projects
              link="https://www.figma.com/design/0F0WevW3dhdkGORIIVwWnv/ATY-PORTFOLIO?node-id=1337-47968&t=M935jwe4SfBdWdoU-1"
              img={Atymockup}
              alt="Two ATY browser screens in Spanish for the Agencia de Transporte de Yucatán: an operator ID card with a QR code and validity date, and a Nuevo ingreso admissions table of applicants with status tags"
              name="ATY"
              description="Drivers's Management Platform Web-Mobile"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
