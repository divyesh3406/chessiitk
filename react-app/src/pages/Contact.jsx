import React from 'react';
import { motion } from 'framer-motion';
import profileImg from '../assets/profile_image.webp';
import ineshImg from "../assets/coordinators/inesh.jpeg";
import lakshImg from "../assets/coordinators/laksh.jpeg";
import rishiImg from "../assets/coordinators/rishi.jpeg";
import rudraImg from "../assets/coordinators/rudra.jpeg";
import shauryaImg from "../assets/coordinators/shaurya.jpeg";
import aarushWaghImg from "../assets/secretaries/aarush_wagh.jpg";
import adityaImg from "../assets/secretaries/aditya.jpg";
import akshatImg from "../assets/secretaries/akshat.jpeg";
import anantImg from "../assets/secretaries/anant.jpeg";
import arhamImg from "../assets/secretaries/arham.jpeg";
import arushImg from "../assets/secretaries/arush.jpg";
import aryanImg from "../assets/secretaries/aryan.jpeg";
import chaitanyaImg from "../assets/secretaries/chaitanya.jpg";
import divyeshImg from "../assets/secretaries/divyesh.jpeg";
import furzaanImg from "../assets/secretaries/furzaan.png";
import hariomImg from "../assets/secretaries/hariom.jpg";
import kratagyaImg from "../assets/secretaries/kratagya.jpg";
import madhavImg from "../assets/secretaries/madhav.jpg";
import mayankBhakhandImg from "../assets/secretaries/mayank_bhakhand.jpeg";
import mayankGautamImg from "../assets/secretaries/mayank_gautam.webp";
import nishantImg from "../assets/secretaries/nishant.jpg";
import piyushImg from "../assets/secretaries/piyush.jpg";
import prajwalImg from "../assets/secretaries/prajwal.jpeg";
import pratikImg from "../assets/secretaries/pratik.jpg";
import swayamImg from "../assets/secretaries/swayam.JPG";
import siddhantImg from "../assets/secretaries/siddhant.jpg";
import shaoniImg from "../assets/secretaries/shaoni.jpg";
import dipinImg from "../assets/secretaries/dipin.jpg";
import lakshyaImg from "../assets/secretaries/lakshya.jpg";
import Footer from '../components/Footer';
const COORDINATORS = [
  {
    id: 'coord-0',
    name: "Inesh Aggarwal",
    role: "Coordinator",
    funnyDescription: `"I wake up and eat parathas with samosational level of enthusiasm"`,
    email: "ineshag24@iitk.ac.in",
    image: ineshImg,
    instagram: "https://www.instagram.com/inesh_aggarwal29/",
    linkedin: "https://www.linkedin.com/in/inesh-aggarwal-579373337/"

  },
  {
    id: 'coord-1',
    name: "Laksh Dhir",
    role: "Coordinator",
    funnyDescription: `"If you find a bottle or ID card at random places on campus, there’s a decent chance it’s mine.."`,
    email: "laksh24@iitk.ac.in",
    image: lakshImg,
    instagram: "https://www.instagram.com/laksh_dhir30",
    linkedin: "https://www.linkedin.com/in/laksh-dhir-1374b5321"
  },
  {
    id: 'coord-2',
    name: "Rishi Gupta",
    role: "Coordinator",
     funnyDescription: `"Achievement:
 Got a 1-month Diamond membership on Samay’s stream after Guki became the World Champ!
"`,
    email: "rishig24@iitk.ac.in",
    image: rishiImg,
    instagram: "https://www.instagram.com/rishig.007/",
    linkedin: "https://www.linkedin.com/in/rishi-gupta-19459231a/"
  },
  {
    id: 'coord-3',
    name: "Rudra Dwivedi",
    role: "Coordinator",
    funnyDescription: `"I look strict to juniors. Then I start talking...
It gets worse."`,
    email: "rudrad24@iitk.ac.in",
    image: rudraImg,
    instagram: "https://www.instagram.com/rudra.dwivedi_18/",
    linkedin: "https://www.linkedin.com/in/rudra-dwivedi-107a5936b"

  },
  {
    id: 'coord-4',
    name: "Shaurya Vats",
    role: "Coordinator",
    funnyDescription: `"Running on chewing gum and the annual 'this is DC's year' agenda."`,
    email: `shauryav24@iitk.ac.in`,
    image: shauryaImg,
    instagram: "https://www.instagram.com/shaurya_vats2006/",
    linkedin: "https://www.linkedin.com/in/shaurya-vats-120859312/"
  }
];

const SECRETARIES = [
  {
    id: "sec-0",
    name: "Aarush Waghmare",
    role: "Secretary",
    funnyDescription: `"En croissant"`,
    image: aarushWaghImg,
    email: "aarushw24@iitk.ac.in",
    instagram: "https://www.instagram.com/aarush_waghmare/",
    linkedin: "https://www.linkedin.com/in/aarush-waghmare/"
  },
  {
    id: "sec-1",
    name: "Aditya Dum",
    role: "Secretary",
    funnyDescription: `"I am high on chess,let's play and enjoy this addiction!!"`,
    image: adityaImg,
    email: "adityasdum25@iitk.ac.in",
    instagram: "https://www.instagram.com/adityadum_07?igsh=MW16MHF5azRzejl6cQ==",
    linkedin: "https://www.linkedin.com/in/aditya-dum-69752a380?utm_source=share_via&utm_content=profile&utm_medium=member_android"
  },
  {
    id: "sec-2",
    name: "Akshat Joshi",
    role: "Secretary",
    funnyDescription: `"The plan was perfect until I played it"`,
    image: akshatImg,
    email: "akshatj25@iitk.ac.in",
    instagram: "https://www.instagram.com/akshatj_005?igsh=Mm5hcjE3aXdmeTc1",
    linkedin: "https://www.linkedin.com/in/akshat-joshi-6a47a0377?utm_source=share_via&utm_content=profile&utm_medium=member_android"
  },
  {
    id: "sec-3",
    name: "Anant Singh",
    role: "Secretary",
    funnyDescription: `"Still looking for the best move"`,
    image: anantImg,
    email: "anantsi25@iitk.ac.in",
    instagram: "https://www.instagram.com/mr.infiinity/?hl=en",
    linkedin: "https://www.linkedin.com/in/anant-singh-667228322/"
  },
  {
    id: "sec-4",
    name: "Arham Nadeem",
    role: "Secretary",
    funnyDescription: `"After every blunder, there is a great move !"`,
    image: arhamImg,
    email: "arhamnadeem25@iitk.ac.in",
    instagram: "https://www.instagram.com/arhamnadeem___/",
    linkedin: "https://www.linkedin.com/in/arham-nadeem-043b35369/"
  },
  {
    id: "sec-5",
    name: "Arush Jain",
    role: "Secretary",
    funnyDescription: `"My opening preparation lasts longer than my actual games."`,
    image: arushImg,
    email: "arushj25@iitk.ac.in",
    instagram: "https://www.instagram.com/arushj876/",
    linkedin: "https://www.linkedin.com/in/arush-jain-0b34a0325/"
  },
  {
    id: "sec-6",
    name: "Aryan Kurade",
    role: "Secretary",
    funnyDescription: `"My opponents fear my unpredictability, so do I."`,
    image: aryanImg,
    email: "skaryan25@iitk.ac.in",
    instagram: "https://www.instagram.com/aryankyayaar._?igsh=a28yZGI4ZmNwa2pz",
    linkedin: "https://www.linkedin.com/in/aryankurade?utm_source=share_via&utm_content=profile&utm_medium=member_android"
  },
  {
    id: "sec-7",
    name: "B Madhav Krishna",
    role: "Secretary",
    funnyDescription: `"Chess is my number one priority"`,
    image: madhavImg,
    email: "bmadhav25@iitk.ac.in",
    // instagram: "https://www.instagram.com/madhav_krishna/",
    linkedin: "https://www.linkedin.com/in/madhav-krishna-6035b6202/"
  },
  {
    id: "sec-8",
    name: "Chaitanya Malhotra",
    role: "Secretary",
    funnyDescription: `"Everything was satisfying until a bishop ruined my smoothered mate :-("`,
    image: chaitanyaImg,
    email: "cmalhotra25@iitk.ac.in",
    instagram: "https://www.instagram.com/chetta_iitk_1121?igsh=MTBiZTJ6aW83dHRhNw==",
    linkedin: "https://www.linkedin.com/in/chaitanya-malhotra-500ba8376?utm_source=share_via&utm_content=profile&utm_medium=member_android"
  },
  {
    id: "sec-9",
    name: "Dipin Pandey",
    role: "Secretary",
    funnyDescription: `"In my defence, the knight jumped out of nowhere."`,
    image: dipinImg,
    email: "dipinpandey25@iitk.ac.in",
    instagram: "https://www.instagram.com/dipinpandey_?igsi=MXc0ZXNwcTRhdGk0Mg%3D%3D&utm_source=qr",
    linkedin: "https://www.linkedin.com/in/dipin-pandey-332936340?utm_source=share_via&utm_content=profile&utm_medium=member_ios"
  },
  {
    id: "sec-10",
    name: "Divyesh Bhattacharyya",
    role: "Secretary",
    funnyDescription: `"Arguing with idiots is like playing chess with a pigeon. No matter how good you are the bird is going to shit on the board"`,
    image: divyeshImg,
    email: "divyeshb25@iitk.ac.in",
    // instagram: "https://www.instagram.com/divyesh_bhattacharyya/",
    linkedin: "https://www.linkedin.com/in/divyesh-bhattacharyya-836b78382/"
  },
  {
    id: "sec-11",
    name: "Furzaan S. Ullah",
    role: "Secretary",
    funnyDescription: `"Every game is a new puzzle to solve."`,
    image: furzaanImg,
    email: "furzaan25@iitk.ac.in",
    instagram: "https://www.instagram.com/furzaan2049?igsh=MWoyZjVkMmJ6emR6eQ==",
    linkedin: "https://www.linkedin.com/in/furzaan-ullah-740604377?utm_source=share_via&utm_content=profile&utm_medium=member_android"
  },
  {
    id: "sec-12",
    name: "Hariom Mishra",
    role: "Secretary",
    funnyDescription: `"Chess taught me patience. My clock says otherwise"`,
    image: hariomImg,
    email: "mhariom25@iitk.ac.in",
    instagram: "https://www.instagram.com/hariom66425?igsh=MWh4c2J0bzhjZzB5aQ==",
    linkedin: "https://www.linkedin.com/in/hariom-mishra-177773369?utm_source=share_via&utm_content=profile&utm_medium=member_android"
  },
  {
    id: "sec-16",
    name: "Mayank Bhakhand",
    role: "Secretary",
    funnyDescription: `"it is always better to sacrifice your opponent's pieces"`,
    image: mayankBhakhandImg,
    email: "mayankb25@iitk.ac.in",
    instagram: "https://www.instagram.com/mayankb9852?igsh=MXduOTl3aXM5MzN5dA==&igsi=MXduOTl3aXM5MzN5dA==",
    linkedin: "https://www.linkedin.com/in/mayank-bhakhand-15b67736a?trk=contact-info"
  },
  {
    id: "sec-17",
    name: "Mayank Gautam",
    role: "Secretary",
    funnyDescription: `"I can spot tactics instantly—after the game."`,
    image: mayankGautamImg,
    email: "gmayank25@iitk.ac.in",
    instagram: "https://www.instagram.com/mayank.iitk?igsh=eWF6engyejNhZHg3",
    linkedin: "https://www.linkedin.com/in/mayank-gautam-48b844376?utm_source=share_via&utm_content=profile&utm_medium=member_android"
  },
  {
    id: "sec-19",
    name: "Nishant",
    role: "Secretary",
    funnyDescription: `"Chess has made me redefine beauty!"`,
    image: nishantImg,
    email: "nishantkr25@iitk.ac.in",
    instagram: "https://www.instagram.com/kalonianishant/",
    // linkedin: "https://www.linkedin.com/in/nishant/"
  },
  {
    id: "sec-20",
    name: "Piyush Agarwal",
    role: "Secretary",
    funnyDescription: `"The only thing I calculate accurately is how much rating I'm about to lose."`,
    image: piyushImg,
    email: "piyushag25@iitk.ac.in",
    instagram: "https://www.instagram.com/piyush.iitk?igsh=MXdjcHFmcjUwOHQ0Yg==",
    linkedin: "https://www.linkedin.com/in/piyush-agarwal-733926393?utm_source=share_via&utm_content=profile&utm_medium=member_android"
  },
  {
    id: "sec-21",
    name: "Prajwal Ravi Rai",
    role: "Secretary",
    funnyDescription: `"I am better than magnus carlsen"`,
    image: prajwalImg,
    email: "prajwalr24@iitk.ac.in",
    instagram: "https://www.instagram.com/prajwal_rai/",
    linkedin: "https://www.linkedin.com/in/prajwal-rai/"
  },
  {
    id: "sec-22",
    name: "Pratik Dhanuka",
    role: "Secretary",
    funnyDescription: `"I enjoy playing chess, chess enjoys playing with my emotions."`,
    image: pratikImg,
    email: "pratikd24@iitk.ac.in",
    instagram: "https://www.instagram.com/prattsss__/",
    linkedin: "https://www.linkedin.com/in/pratik-dhanuka-7789023b5/"
  },
  {
    id: "sec-23",
    name: "Shaoni Mukherjee",
    role: "Secretary",
    funnyDescription: `"Life is like chess. I don't know how to play chess."`,
    image: shaoniImg,
    email: "shaonim25@iitk.ac.in",
    instagram: "https://www.instagram.com/shaoni_mukherjee/",
    linkedin: "https://www.linkedin.com/in/shaoni-mukherjee-618b0b316?utm_source=share_via&utm_content=profile&utm_medium=member_android"
  },
  {
    id: "sec-24",
    name: "Siddhant Ghate",
    role: "Secretary",
    funnyDescription: `"My favourite chess opening is the one where my opponent doesn't show up."`,
    image: siddhantImg,
    email: "gssiddhant25@iitk.ac.in",
    instagram: "https://www.instagram.com/sidd070907/",
    linkedin: "https://www.linkedin.com/in/siddhant-ghate-08214936a/"
  },
  {
    id: "sec-25",
    name: "Swayam Krishna Manohari",
    role: "Secretary",
    funnyDescription: `"I’m not a bad chess player, I’m the biggest philanthropist in the community. I generously donate my pieces to needy opponents every single game."`,
    image: swayamImg,
    email: "mkswayam25@iitk.ac.in",
    instagram: "https://www.instagram.com/swayam_boi/",
    linkedin: "https://www.linkedin.com/in/swayam-krishna-manohari-44988b369/"
  }
];
const ContactCard = ({ person }) => (
  <div
    className="group relative bg-surface-container-low rounded-2xl overflow-hidden shadow-lg hover:shadow-[0_20px_40px_rgba(242,202,80,0.15)] transition-all duration-500 flex flex-col h-full border border-outline-variant/5 hover:border-primary/30 cursor-pointer"
  >
    <div className="relative h-72 overflow-hidden flex-shrink-0">
      <img
        alt={person.name}
        className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-110"
        src={person.image}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent transition-opacity duration-500 opacity-90 group-hover:opacity-60"></div>

      <div className="absolute bottom-0 left-0 w-full p-6 translate-y-6 group-hover:translate-y-0 transition-transform duration-500 ease-out z-20">
        <h5 className="text-2xl font-serif font-bold text-on-surface mb-1 drop-shadow-md group-hover:text-primary transition-colors duration-300">{person.name}</h5>
      </div>
    </div>

    <div className="p-6 pt-5 bg-surface-container-lowest flex-grow flex flex-col justify-between relative overflow-hidden border-t border-outline-variant/10">
      {/* Subtle decorative quote mark */}
      <span className="absolute -bottom-8 -right-4 text-9xl font-serif text-on-surface-variant/5 select-none group-hover:text-primary/5 transition-colors duration-500">"</span>
      <p className="text-sm text-on-surface-variant leading-relaxed relative z-10 group-hover:text-on-surface/90 transition-colors duration-500">
        {person.funnyDescription}
      </p>

      {/* Social / Contact Icons Bar */}
      {(person.instagram || person.linkedin || person.email) && (
        <div className="flex items-center justify-center gap-6 relative z-10 pt-4 border-t border-outline-variant/10">
          {person.instagram && (
            <a
              href={person.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-primary transition-colors duration-300"
              aria-label="Instagram"
            >
              <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
          )}

          {person.linkedin && (
            <a
              href={person.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-primary transition-colors duration-300"
              aria-label="LinkedIn"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z"/>
              </svg>
            </a>
          )}

          {person.email && (
            <a
              href={`mailto:${person.email}`}
              className="text-zinc-400 hover:text-primary transition-colors duration-300"
              aria-label="Email"
            >
              <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </a>
          )}
        </div>
      )}
    </div>
  </div>
);

const Contact = () => {
  return (
    <div>
      <div className="px-4 sm:px-6 md:px-12 pb-20 max-w-7xl mx-auto">
        {/* Coordinators Section */}
        <section className="mb-16 mt-8">
          <div className="flex flex-col items-center mb-10 text-center max-w-3xl mx-auto">

            <h1 className="text-4xl font-serif leading-tight text-on-surface sm:text-5xl">Coordinators </h1>
            {/* <p className="mt-3 text-sm font-light leading-relaxed text-on-surface-variant/80 sm:text-base">
              Get in touch with the executive leadership and team members of Chess Club IIT Kanpur.
            </p> */}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {COORDINATORS.map((person, idx) => (
              <ContactCard key={person.id} person={person} index={idx} />
            ))}
          </div>
        </section>

        {/* Secretaries Section */}
        <section className="mb-20">
          <div className="flex flex-col items-center mb-12 text-center">

            <h2 className="text-5xl font-serif font-bold tracking-tighter text-on-surface">Secretaries</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {SECRETARIES.map((person, idx) => (
              <ContactCard key={person.id} person={person} index={idx} />
            ))}
          </div>
        </section>

        {/* Footer matching Blogs.jsx */}



      </div>
      <Footer />

    </div>
  );
}

export default Contact;