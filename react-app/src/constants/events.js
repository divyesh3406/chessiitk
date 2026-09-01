export const OFFICIAL_EVENTS = [
  {
    id: 6,
    title: "Fog of War Tournament",
    date: "June 20, 2026",
    tag: "Tournament",
    time: "9:00 PM Onwards",
    location: "chess.com",
    format: "Fog of War Chess (3+0 Qualifying / 3+2 Knockouts)",
    shortDesc:
      "A unique chess variant where players cannot see all of their opponent's pieces. Strategy, intuition, and a bit of luck will decide the winner.",
    fullDesc:
      "Want to try something offbeat? Chess Club IITK brings you Fog of War, a thrilling chess variant that blends strategy with uncertainty. Navigate through the fog, uncover your opponent's plans, and outsmart them in this exciting format. If you can't see your opponent's pieces, they probably can't see yours either—or can they?",
    schedule: [
      {
        time: "Jun 20th",
        activity: "Online Qualifier Arena (3+0) – 9:00 PM Onwards"
      },
      {
        time: "Jun 21st",
        activity: "Knockout Matches (3+2) – 9:00 PM Onwards"
      }
    ],
    prizes: "Bragging rights and the title of IITK Fog of War Champion!"
  },
  {
    id: 1,
    title: "League of Legends 6.0",
    tag: "Tournament",
    date: "August 7, 2026",
    time: "Multiple Days",
    location: "chess.com",
    format: "4-Player Team Blitz (3+2 Qualifiers / 5+0 Knockouts)",
    shortDesc:
      "An open-for-all 4-player team event. Qualifiers start August 7th with the best advancing to knockouts!",
    fullDesc:
      "Form a 4-player team and compete in the legendary online qualifier arena (3+2 blitz format) on August 7th! The stakes are high: only the top 6 teams overall, along with the top 2 Alumni teams, will qualify for the knockouts. The semi-finals and finals knockouts will transition to a high-pressure 5+0 format.",
    schedule: [
      { time: "Aug 7th", activity: "Qualifier Arena (Blitz 3+2)" },
      { time: "Aug 8th", activity: "Semi-Finals Knockouts (Blitz 5+0)" },
      { time: "Aug 9th", activity: "Grand Finals (Blitz 5+0)" }
    ],
    prizes: "Winning team gets 4 Gold Memberships!"
  },
  {
    id: 2,
    title: "Fresher's Chess League",
    date: "August 21, 2026",
    tag: "Tournament",
    time: "Multiple Days",
    location: "Senate Hall & OAT",
    format: "8-Player Team OTB (Auctions + Pool Stages 10+5)",
    shortDesc:
      "An 8-player team OTB tournament featuring offline auctions, pools, and knockouts!",
    fullDesc:
      "Experience the thrill of OTB chess! The tournament begins on August 21st with an offline auction in the Senate Hall to distribute players into 8 teams. The teams will be divided into 2 pools of 4 teams each. You will battle it out in a Round Robin stage (10+5 format) where each team plays the other 3. The top 2 teams from each pool advance to the fiery semi-finals and finals on August 23rd!",
    schedule: [
      { time: "Aug 21st", activity: "Player Auctions (Senate Hall)" },
      { time: "Aug 22nd", activity: "Round Robin Pool Stages (OAT)" },
      { time: "Aug 23rd", activity: "Semi-Finals & Finals (OAT)" }
    ],
    prizes: "8 Gold Memberships for Winners + Mama Mio Coupons for Top 50!"
  },
  {
    id: 14,
    title: "IITK Candidates 2026",
    tag: "Tournament",
    date: "August 23, 2026",
    endDate: "September 4, 2026",
    time: "Multiple Days",
    location: "Campus / Online",
    format: "Classical / Rapid",
    shortDesc:
      "The premier IITK Candidates Tournament running from 23rd August to 4th September 2026.",
    fullDesc:
      "The IITK Candidates Tournament features top players of IIT Kanpur competing for championship honors from August 23rd to September 4th, 2026.",
    schedule: [
      { time: "Aug 23rd", activity: "Opening Rounds" },
      { time: "Sep 4th", activity: "Final Round & Closing" }
    ],
    prizes: "Championship Honors & IITK Candidates Title!"
  },
  /*
  {
    id: 3,
    title: "IITK Grand Swiss",
    date: "October 2, 2026",
    tag: "Tournament",
    time: "Multiple Days",
    location: "Hall 3 Mess",
    format: "Individual OTB (7-Round Swiss Rapid 10+5)",
    shortDesc:
      "A 7-round Swiss OTB tournament. The gateway to the Candidates and the Chess Cup!",
    fullDesc:
      "Calling all chess enthusiasts! The IITK Grand Swiss is entirely an Over-The-Board (OTB) tournament played under a 10+5 rapid time format using the Swiss System format. Across 7 grueling rounds, players will battle it out to secure highly coveted spots in the next IITK Candidates tournament and the Chess Cup.",
    schedule: [
      { time: "Oct 2nd", activity: "Rounds 1 - 3" },
      { time: "Oct 3rd", activity: "Rounds 4 & 5" },
    ],
    prizes: "Top 3: Candidates. Pos 4-17: Chess Cup. Top 5: Gold Memberships. Top 50: Coupons."
  },
  */
  /*
  {
    id: 4,
    title: "Speed Chess Championship",
    date: "December 27, 2026",
    tag: "Tournament",
    time: "TBD",
    location: "chess.com",
    format: "Individual Online (Blitz 3+1 / Bullet 1+1)",
    shortDesc:
      "The ultimate battle of speed and precision. Compete in blitz and bullet formats to become the Speed Chess Champion of IITK!",
    fullDesc:
      "The Speed Chess Championship is IITK's premier fast-time-control event. Players will compete across blitz and bullet formats, testing their tactical sharpness, intuition, and nerves under intense time pressure. The championship begins with an open online qualifier arena, followed by the main championship stages over the next two days.",
    schedule: [
      {
        time: "Dec 26th",
        activity: "Qualifier Arena (1 Hour Blitz 3+1, 30 Minutes Bullet 1+1)"
      },
      {
        time: "Dec 27th-28th",
        activity: "Championship Stage (45 Minutes Blitz 3+1, 30 Minutes Bullet 1+1)"
      }
    ],
    prizes: "Winner becomes the Speed Chess Champion of IITK!"
  },
  {
    id: 8,
    title: "FIDE Rated Open Rapid Chess Tournament 2027",
    date: "February 7, 2027",
    tag: "Tournament",
    time: "9:00 AM Onwards",
    location: "IIT Kanpur Campus, Uttar Pradesh, India",
    format: "FIDE Rated OTB (9-Round Swiss Rapid 10+5)",
    shortDesc:
      "The first-ever FIDE Rated Chess Tournament hosted by Chess Club IITK, featuring 9 Swiss rounds and a ₹2,0,000 prize pool.",
    fullDesc:
      "A new chapter in IIT Kanpur's chess legacy begins with the FIDE Rated Open Rapid Chess Chess Tournament 2026. This over-the-board event features 9 Swiss rounds played in a 10+5 rapid format. Players from across the country will battle for rating points, glory, and a massive ₹2,0,000 prize fund.",
    schedule: [
      {
        time: "Feb 7th",
        activity: "9 Swiss Rounds (Rapid 10+5)"
      }
    ],
    prizes: "Prize Fund Worth ₹2,0,000!"
  },
  {
    id: 7,
    title: "Chess Masters Premier League 5.0",
    date: "March 3, 2027",
    tag: "Tournament",
    time: "7:00 PM Onwards",
    location: "Online",
    format: "Team Online (League Stages + Playoffs)",
    shortDesc:
      "The flagship premier league of Chess Club IITK featuring top players, elite competition, and a massive ₹9+ Lakhs prize pool.",
    fullDesc:
      "Chess Masters Premier League 3.0 brings together some of the strongest chess players in the country for an exciting week-long competition. Featuring a prize pool exceeding ₹9 Lakhs and supported by leading chess organizations, the event promises high-level games, intense rivalries, and unforgettable moments.",
    schedule: [
      {
        time: "Mar 3rd",
        activity: "Opening Round & League Stage Begins"
      },
      {
        time: "Mar 4th-8th",
        activity: "League Stage Matches"
      },
      {
        time: "Mar 9th",
        activity: "Playoffs & Grand Finals"
      }
    ],
    prizes: "Prize Pool Worth ₹9+ Lakhs!"
  },
  {
    id: 5,
    title: "IITK Chess Cup 2027",
    date: "April 3, 2027",
    tag: "Tournament",
    time: "Multiple Days",
    location: "Venue announced via WhatsApp Group",
    format: "Individual OTB (Blitz 3+2 Qualifiers / Rapid 10+5 Knockouts)",
    shortDesc:
      "The ultimate chess showdown. Compete with the best, outplay your opponents, and fight for a place in the IITK Candidates Tournament.",
    fullDesc:
      "Tired of quizzes and labs? Time to enter the ultimate chess showdown! The IITK Chess Cup 2026 begins with a 90-minute online blitz qualifier arena. The top 48 players will advance to the offline knockout stage, where every move matters.",
    schedule: [
      {
        time: "Apr 3rd",
        activity: "90-Minute Online Blitz Arena (3+2 Qualifier)"
      },
      {
        time: "Apr 4th",
        activity: "Offline Knockout Matches (Rapid 10+5)"
      },
      {
        time: "Apr 5th",
        activity: "Final Knockout Matches (Rapid 10+5)"
      }
    ],
    prizes: "Top 4 players qualify for the IITK Candidates Tournament!"
  }
  */
];
