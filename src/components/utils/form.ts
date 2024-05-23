/*
  what are you curious about or working on? it can be anything.
maybe an app, youtube channel, short story. literally anything.
shoot me like 1-2 sentences on an idea or something you wanna explore.
 

what's one area you'd be most excited to start with?

picture

basic deets. (pt 1)
what's your preferred pronouns?
*
we wanna make sure sage refers to you correctly :).
what's your preferred pronouns?
a

she/her
b

he/him
c

they/them
d

other
e

prefer not to say
are you working on any of your own ideas rn?
*
could be anything! an app you're making on the side, a new music track, the first chapters of your new book, a startup you are building, whatever.
it's also perfectly fine to not be working on anything rn. a lot of people in nights and weekends are just starting off, so that's perfectly fine :)
are you working on any of your own ideas rn?

yes -- i'm working full-time on my own ideas right now.

yes -- working on my own ideas on the nights & weekends.

no -- i'm not working on my own ideas atm.
cool. what are you working on rn? 1-2 sentences is fine.
*
give us the project's name (if you have one), the one-liner, and what you're trying to do!
im building a school for ppl to become hokage
how far along is your project rn in terms of numbers?
*
we just wanna get a sense of where you are at with it.
ex:
$100 in revenue
10,000 yt subscribers 
1,000 sign-ups
$10k mrr
2,500 monthly listeners 
whatever!
and if you're at zero then that's cool to.
tell us all about any milestones you've hit or things you're proud of in the last 6-12 months in relation to your work, hobby, and/or career.
*
this doesn't need to be polished.
write like 4-5 sentences.
feel free to word vomit. tell us about all the things ex. a round you recently raised, a new skill that took your work to the next level, a big milestone you hit in terms of metrics, etc.
random -- whats the most viral thing you've ever created/done? tell us the story + how many people it got to!
*
virality is subjective to u. if u only made 1 thing ever and it got 10 views. that's huge. just share your story :)
click on the "add images" button on your profile preview pane and drop 3 images that show what you do.
imagine someone could only see 3 pictures to understand what it is you work on/do.
what 3 images do you show?

note: these will be shown to others when they find you in sage & during nights & weekends.

here are braeden's 3 pics (startup founder)
here are dante's 3 pics (content creator)
here are sam's 3 pics (designer at a company)

ex:
screenshots of your app
a screenshot of a tweet that blew up.
a screenshot of an insta reel you were proud of
screenshot of your analytics
pic of u singing if you're a musician
pic of your robots if you make robots
pic of you rock climbing if you love rock climbing lol
pic of u watching naruto if you love naruto.

let's dive a lil deeper. (pt 2)
when it comes to building stuff, what are you good at? what are you confident doing?
*
if you don't have that one thing you're confident with, that's fine. tell us about something you're really focused at improving at right now.
ex.
- i'm confident as a swift ios dev because i've built like 10 apps.
- i'm good at marketing + google ads because i've ran massive campaigns.
- i am not the best designer right now, but i'm spending a lot of time working on my design skills.
imagine someone on the street pulls you aside and says "what's your life story in 10-15 bullet points?"

what are your 10-15 bullets?
*
give us the highlights.
please also include major projects you built and also include key places you've worked. 
- i was born in pakistan
- i started my first company at 13 selling dvds
- got it to $100k in rev by 15
- etc
- etc
- worked as a deep learning eng at mayhem.gg in 2018
- was cto of a gaming startup named kanga in 2019
- etc
what's your biggest struggle right now in terms of your work / career / hobby? what do you need help with?
*
what's stopping you from getting to that next level you think?
ex.
- i need marketing help
- i need help building my new editor app
- i need some investors
- i need to hire some ppl
- etc


work, investors, cofounders. (pt 3)
would you be open to being hired, contracted, or open to seeing new work opportunities from someone else?
*
would you be open to being hired, contracted, or open to seeing new work opportunities from someone else?

absolutely

maybe

no
what kind of roles/jobs would you be open to? what makes you a good pick?
ex. i'd be open to working full-time for a startup as an engineer.
ex. i'd be open to being hire for ml engineer contract work
ex. i'd open to music production work
are you hiring for your own initiative?
*
this means you are offering paid full-time or contract roles.
are you hiring for your own initiative?

yes

not right now
tell us a few roles you're hiring for/ what you are looking for in a hire.
*
also tell us if this is contract, full-time, remote, etc. no links plz.
are you looking for a cofounder or collaborators?
*
are you looking for a cofounder or collaborators?

yes

no 
tell us more -- what types of collaborators are you looking for?
*
ex. i want to find someone to join on as my cto.
are you an investor or an angel investor?
this doesn't mean you trade bitcoin or stocks.
it means you give people money to work on their ideas in exchange for equity, revenue, etc.
generally, this means your either an actual investor at a firm that invests millions, or just an individual that would invest at minimum $10,000 in an initiative you believe in.
are you an investor or open to being an angel investor?

yes
*

no 
what kind of people, domains, companies etc would you be down to invest in?
*
ex. hardtech startups, viral tiktok creators, etc.
are you looking for investors yourself?
*
are you looking for investors yourself?

yes

no 
imagine i put you in front of an investor right now and you have to convince them to invest in 2-3 sentences. what do you tell them?
*
ex. how much money are you looking for, what's the current pitch, what's the business at, etc.

finally, live on the internet? (pt 4)
what's the one link you wanna show the world?
this will be shown on your profile.
  */

import { z } from "zod";

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const UserFormQuestions = {
  mainForm: [
    {
      question: "what are you curious about or working on?",
      info: "it can be anything. maybe an app, youtube channel, short story. literally anything.",
      type: "text",
      name: "curiousAbout" as const,
      required: true,
    },
    {
      question: "what's one area you'd be most excited to start with?",
      type: "text",
      name: "excitedAbout" as const,
      required: true,
    },
    {
      question: "upload a picture that shows who you are",
      info: "upload any image if you wanna stay anonymous. you can change this later",
      type: "file",
      limit: 1,
      name: "profilepic" as const,
      accept: ACCEPTED_IMAGE_TYPES,
      required: true,
    },
  ],
  basics: [
    {
      question: "what's your preferred pronouns?",
      info: "we wanna make sure jack refers to you correctly :).",
      type: "options",
      options: ["he/him", "she/her", "they/them", "other", "prefer not to say"],
      name: "pronouns",
    },
    {
      question: "are you working on any of your own ideas rn?",
      type: "options",
      info: "could be anything! an app you're making on the side, a new music track, the first chapters of your new book, a startup you are building, whatever. it's also perfectly fine to not be working on anything rn.",
      options: [
        "yes -- i'm working full-time on my own ideas right now.",
        "no -- i'm not working on my own ideas atm.",
      ],
      name: "workingOnOwnIdeas",
    },
    {
      question: "cool. what are you working on rn? 1-2 sentences is fine.",
      type: "text",
      name: "workingOn",
      dependsOn: "workingOnOwnIdeas",
    },
    {
      question: "how far along is your project rn in terms of numbers?",
      type: "text",
      info: "we just wanna get a sense of where you are at with it. ex:$100 in revenue,10,000 yt subscribers, 1,000 sign-ups,$10k mrr, 2500 monthly listeners, whatever! and if you're at zero then that's cool to.",
      dependsOn: "workingOnOwnIdeas",
    },
    {
      question:
        "tell us all about any milestones you've hit or things you're proud of in the last 6-12 months in relation to your work, hobby, and/or career.",
      type: "text",
      info: "this doesn't need to be polished. write like 4-5 sentences. tell us about all the things ex. a round you recently raised, a new skill that took your work to the next level, a big milestone you hit in terms of metrics, etc.",
    },
    {
      question:
        "random -- whats the most viral thing you've ever created/done? tell us the story + how many people it got to!",
      type: "text",
      info: "virality is subjective to u. if u only made 1 thing ever and it got 10 views. that's huge. just share your story :)",
    },
    {
      question:
        'click on the "add images" button on your profile preview pane and drop 3 images that show what you do. imagine someone could only see 3 pictures to understand what it is you work on/do. what 3 images do you show?',
      info: "these will be shown to others when they find you in sage & during nights & weekends. ex: screenshots of your app, a screenshot of a tweet that blew up. a screenshot of an insta reel you were proud of screenshot of your analytics",
      type: "image",
      limit: 3,
    },
  ],
};

export const MainFormSchema = z.object({
  curiousAbout: z.string().min(10, {
    message: "",
  }),
  excitedAbout: z.string().min(10, {
    message: "",
  }),
  profilepic: z
    .any()
    .refine((file) => file?.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ),
});
