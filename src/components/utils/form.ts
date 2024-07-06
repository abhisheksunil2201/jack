import { z } from "zod";

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [".jpeg", ".jpg", ".png", ".webp"];

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
      type: "select",
      options: ["he/him", "she/her", "they/them", "other", "prefer not to say"],
      name: "pronouns" as const,
      required: true,
    },
    {
      question: "are you working on any of your own ideas rn?",
      type: "select",
      info: "could be anything! an app you're making on the side, a new music track, the first chapters of your new book, a startup you are building, whatever. it's also perfectly fine to not be working on anything rn.",
      options: [
        "yes -- i'm working full-time on my own ideas right now.",
        "no -- i'm not working on my own ideas atm.",
      ],
      name: "workingOnOwnIdeas" as const,
      required: true,
    },
    {
      question: "cool. what are you working on rn? 1-2 sentences is fine.",
      type: "text",
      name: "workingOn" as const,
      dependsOn: "workingOnOwnIdeas",
      expectedDependantValue:
        "yes -- i'm working full-time on my own ideas right now.",
      required: true,
    },
    {
      question: "how far along is your project rn in terms of numbers?",
      type: "text",
      info: "we just wanna get a sense of where you are at with it. ex:$100 in revenue,10,000 yt subscribers, 1,000 sign-ups,$10k mrr, 2500 monthly listeners, whatever! and if you're at zero then that's cool to.",
      dependsOn: "workingOnOwnIdeas",
      name: "projectProgress" as const,
      expectedDependantValue:
        "yes -- i'm working full-time on my own ideas right now.",
      required: true,
    },
    {
      question:
        "tell us all about any milestones you've hit or things you're proud of in the last 6-12 months in relation to your work, hobby, and/or career.",
      type: "text",
      info: "this doesn't need to be polished. write like 4-5 sentences. tell us about all the things ex. a round you recently raised, a new skill that took your work to the next level, a big milestone you hit in terms of metrics, etc.",
      required: true,
      name: "milestones" as const,
    },
    {
      question:
        "random -- whats the most viral thing you've ever created/done? tell us the story + how many people it got to!",
      type: "text",
      info: "virality is subjective to u. if u only made 1 thing ever and it got 10 views. that's huge. just share your story :)",
      required: true,
      name: "viralThing" as const,
    },
    {
      question:
        'click on the "add images" button on your profile preview pane and drop 3 images that show what you do. imagine someone could only see 3 pictures to understand what it is you work on/do. what 3 images do you show?',
      info: "these will be shown to others when they find you in sage & during nights & weekends. ex: screenshots of your app, a screenshot of a tweet that blew up. a screenshot of an insta reel you were proud of screenshot of your analytics",
      type: "file",
      limit: 3,
      required: true,
      name: "images" as const,
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
  profilepic: z.any(),
});

export const BasicFormSchema: any = z.object({
  pronouns: z.enum(
    ["he/him", "she/her", "they/them", "other", "prefer not to say"],
    {
      required_error: "Please give us your pronouns",
    }
  ),

  workingOnOwnIdeas: z.enum(
    [
      "yes -- i'm working full-time on my own ideas right now.",
      "no -- i'm not working on my own ideas atm.",
    ],
    {
      required_error: "tell us if you're working on your own ideas",
    }
  ),
  workingOn: z.string().min(10, {
    message: "what are you working on rn?",
  }),
  milestones: z.string().min(10, {
    message: "any mailestones you've hit or things you're proud of",
  }),
  viralThing: z.string().min(10, {
    message: "write about the most viral thing you've ever created",
  }),
  projectProgress: z.string().min(10, {
    message: "any numbers you have on your project rn",
  }),
  images: z
    .array(z.any())
    .min(1, {
      message:
        "add at least 1 image. let the world know who you are and what you do :)",
    })
    .refine(
      (files) => files.every((file) => file.size <= MAX_FILE_SIZE),
      "Max image size is 5MB."
    )
    .refine(
      (files) =>
        files.every((file) => ACCEPTED_IMAGE_TYPES.includes(file?.type)),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ),
});

export type MainFormType = typeof UserFormQuestions.mainForm;
export type BasicFormType = typeof UserFormQuestions.basics;

export const generateUserDataFromFormForAI = (
  form: z.infer<typeof BasicFormSchema>
): string => {
  const {
    milestones,
    pronouns,
    viralThing,
    workingOn,
    workingOnOwnIdeas,
    projectProgress,
  } = form;
  const milestonesModified = `Milestones: ${milestones ?? ""}`;
  const viralThingModified = `Viral Thing: ${viralThing ?? ""}`;
  const pronounsModified = `Pronouns: ${pronouns ?? ""}`;
  const workingOnModified = `Working On: ${workingOn ?? ""}`;
  const workingOnOwnIdeasModified = `Working On Own Ideas: ${
    workingOnOwnIdeas ?? ""
  }`;
  const projectProgressModified = `Project Progress: ${projectProgress ?? ""}`;
  return `Generate a detailed professional bio for a person based on the following information. The bio should be written in third person and span multiple paragraphs. Include only information that is directly provided or can be reasonably inferred from the input. Do not add any details or achievements that are not mentioned. The bio should focus on the person's current work, projects, and aspirations. Use the pronouns provided. Here's the information:
"\n${milestonesModified} \n${viralThingModified} \n${pronounsModified} \n${workingOnModified} \n${workingOnOwnIdeasModified} \n${projectProgressModified} \n`;
};
