import '../styles/css/footer.css'

import facebookIcon from '../images/facebook.png'
import instagramIcon from '../images/instagram.png'
import twitterIcon from '../images/twitter.png'
import telegramIcon from '../images/telegram.png'
import linkedinIcon from '../images/linkedin.png'
import googleMapsIcon from '../images/google-maps.png'
import ukraineIcon from '../images/Ukraine.png'

function FooterApp() {
    const currentYear = new Date().getFullYear()

    return (
        <div className="footer">
            <div className="logo">
                <div className="logo__name">RealEstateNavigator</div>
                <div className="logo__slogan">Landmark in the world of real estate</div>
            </div>
            <div className="social-networks">
                <ul className="social-networks__list">
                    <li className="social-network__item fecebook">
                        <a href="https://facebook.com">
                            <img className="social-network__icon" src={facebookIcon} alt="facebook.png" />
                        </a>
                    </li>
                    <li className="social-network__item instagram">
                        <a href="https://instagram.com">
                            <img className="social-network__icon" src={instagramIcon} alt="instagram.png" />
                        </a>
                    </li>
                    <li className="social-network__item twitter">
                        <a href="https://twitter.com">
                            <img className="social-network__icon" src={twitterIcon} alt="twitter.png" />
                        </a>
                    </li>
                    <li className="social-network__item telegram">
                        <a href="https://web.telegram.org">
                            <img className="social-network__icon" src={telegramIcon} alt="telegram.png" />
                        </a>
                    </li>
                    <li className="social-network__item linkedin">
                        <a href="https://linkedin.com">
                            <img className="social-network__icon" src={linkedinIcon} alt="linkedin.png" />
                        </a>
                    </li>
                    <li className="social-network__item google-maps">
                        <a href="http://surl.li/tjkac">
                            <img className="social-network__icon" src={googleMapsIcon} alt="google-maps.png" />
                        </a>
                    </li>
                </ul>
            </div>
            <div className="general-data">
                <div className="general-data__country">
                    <img className="general-data__country-icon" src={ukraineIcon} alt="ukrainian-flag.png" />
                    <span className="general-data__country-name">Ukraine</span>
                </div>
                <div className="general-data__gmail">000055555w@gmail.com</div>
                <div className="general-data__copyright">© {currentYear} RealEstateNavigator</div>
            </div>
        </div>
    )
}

export default FooterApp