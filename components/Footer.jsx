import Image from "next/image";
import ueLogo from "../public/images/ue-logo.png";
import { Button } from "./ui/button";
import ce2logo from "../public/images/climateurope_white.png";
import { FaXTwitter, FaYoutube, FaLinkedinIn } from 'react-icons/fa6'

function Footer() {
  return (
    <>
      <div className="footer flex-col ce2-background gap-4 p-4">
        <div className="flex">
          <div>
            <Image src={ueLogo} alt="European Union logo" width={300} />
            <p>
              This project has received funding from the European Union's
              Horizon Europe research and innovation programme under grant
              agreement No 101056933. Views and opinions expressed are however
              those of the author(s) only and do not necessarily reflect those
              of the European Union or the European Climate, Infrastructure and
              Environment Executive Agency (CINEA). Neither the European Union
              nor the granting authority can be held responsible for them.
            </p>
          </div>
          <div className="keep-in-touch">
            <p>
              To keep up to date with our upcoming events, latest news and
              activities, please subscribe to our mailing list.{" "}
            </p>
            <a target="_blank" href="https://form.typeform.com/to/j28bLgdT?typeform-source=climateurope2.eu">
              <Button className="mt-4" variant={"ce2"}>Subscribe</Button>
            </a>
          </div>
        </div>
        <div className="flex social-icons items-center justify-center gap-4">
          <a target="_blank" href="https://www.climateurope2.eu">
            <Image className="footer-logo" src={ce2logo} alt="climateurope2 logo" width={150} />
          </a>
          <div className="flex justify-center gap-5">
            <span>&copy; All Rights Reserved</span>
            <a target="_blank" href="https://climateurope2.eu/privacy-policy">Privacy Policy</a>
            <a target="_blank" href="https://climateurope2.eu/legal-notice">Legal Notice</a>
            <a target="_blank" href="https://earth.bsc.es/climateurope2/doku.php">Wiki</a>
          </div>
          <div className="flex gap-3 justify-center text-lg">          
            <a target="_blank" href="https://x.com/climateurope2"><FaXTwitter /></a>
            <a target="_blank" href="https://www.linkedin.com/company/88887279"><FaLinkedinIn /></a>
            <a target="_blank" href="https://www.youtube.com/channel/UCrPqbvdqd9bwGx9_CwuprUg"><FaYoutube /></a>
          </div> 
        </div>
      </div>
    </>
  );
}

export default Footer;
