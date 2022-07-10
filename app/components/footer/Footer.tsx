import React from "react";
import {
  FaLinkedinIn,
  FaGithub,
  FaYoutube,
  FaInstagram,
  FaFacebookF,
} from "react-icons/fa";
import styles from './style.module.css';


const Footer = () => {
  return (
    <>
      <footer className={styles.footer}>
        <div className={styles.footer_content}>
          <h3>Typescript Blog</h3>
          <p>
          Typescript Blog is a blog website where you will find great
            tutorials on web design and development. Here each tutorial is
            beautifully described step by step with the required source code.
          </p>
          <ul className={styles.socials}>
            <li>
              <a  target="_blank" href="https://www.linkedin.com/in/md-razu-islam-48b848233">
                <FaLinkedinIn />
              </a>
            </li>
            <li>
              <a  target="_blank" href="https://github.com/jsdevraju">
                <FaGithub />
              </a>
            </li>
            <li>
              <a  target="_blank" href="https://www.instagram.com/jsdevrazu">
                <FaInstagram />
              </a>
            </li>
            <li>
              <a  target="_blank" href="https://www.facebook.com/islamraazu">
                <FaFacebookF />
              </a>
            </li>
            <li>
              <a  target="_blank" href="https://www.youtube.com/channel/UCv54fMK_UR7SJX70W02usaA">
                <FaYoutube />
              </a>
            </li>
          </ul>
        </div>
        <div className={styles.footer_bottom}>
          <p>
            This build only education purpose copyright &copy;{ new Date().getFullYear()} <a target="_blank" href="https://jsdevrazu.vercel.app">jsdevraju</a>
          </p>
        </div>
      </footer>
    </>
  );
};

export default Footer;
