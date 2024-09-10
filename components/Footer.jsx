import Image from "next/image";
import ueLogo from "../public/images/ue-logo.png";
import {Button} from "./ui/button"
import Link from "next/link";

function Footer() {
  return (
    <>
      <div className="footer flex ce2-background gap-4 p-4">
        <div className="">
          <Image className="" src={ueLogo} />
          <p>
            This project has received funding from the European Union's Horizon Europe research and innovation programme under grant agreement No
            101056933. Views and opinions expressed are however those of the author(s) only and do not necessarily reflect those of the European
            Union or the European Climate, Infrastructure and Environment Executive Agency (CINEA). Neither the European Union nor the
            granting authority can be held responsible for them.
          </p>
        </div>
        <div className="text-end">
          <p>To keep up to date with our upcoming events, latest news and activities, please subscribe to our mailing list. </p>
          <a target="_blank" href={'https://form.typeform.com/to/j28bLgdT?typeform-source=climateurope2.eu'} blank>
            <Button>Subscribe</Button>
          </a>
        </div>
      </div>
    </>
  );
}

export default Footer;