class Globals {
    constructor() {
        this.state = 0;
        this.name = "";
        this.year = 0;
        this.strengthIndex = 0;
        this.activityIndex = 0;
        this.welcomeEnterDisplayed = false;
        this.enterKeyAnimInProg = true;
        this.loading = [];
        this.additionalTime = 2000;
        this.month = (new Date().getMonth());
        this.day = (new Date().getDate());
        this.zodiac = "";
        this.age = 0;
        this.quote = [];
        this.info = {
            "source": "https://www.astrology-zodiac-signs.com",
            "date": "July 25, 2020, 9:23 PM EST",
            "aquarius": {
                "emoji": "🌊",
                "range": "January 20 - February 18",
                "numbers": "4, 7, 11, 22, 29",
                "strengths": "progressive, original, independent, humanitarian",
                "activities": "fun with friends, helping others, fighting for causes, intellectual conversation, a good listener",
                "cheer1": "You will bring enthusiasm to wherever you go with your talented imagination and high intellect!",
                "cheer2": "You will continue to be great at managing your money!"
            },
            "pisces": {
                "emoji": "🐟",
                "range": "February 19 - March 20",
                "numbers": "3, 9, 12, 15, 18, 24",
                "strengths": "compassionate, artistic, intuitive, gentle, wise, musical",
                "activities": "being alone, sleeping, music, romance, visual media, swimming, spiritual themes",
                "cheer1": "You are gentle and caring; you can be the best friend of many!",
                "cheer2": "Your decisions with money can be unpredictable, but you will always have enough at the end for a normal life!"
            },
            "aries": {
                "emoji": "🐏",
                "range": "March 21 - April 19",
                "numbers": "1, 8, 17",
                "strengths": "courageous, determined, confident, enthusiastic, optimistic, honest, passionate",
                "activities": "comfortable clothes, taking on leadership roles, physical challenges, individual sports",
                "cheer1": "You are always eager to form new relationships and connections with others!",
                "cheer2": "You will make a good leader with your bold quick-thinking mindset and willingness to take on any competition!"
            },
            "taurus": {
                "emoji": "🐂",
                "range": "April 20 - May 20",
                "numbers": "2, 6, 9, 12, 24",
                "strengths": "reliable, patient, practical, devoted, responsible, stable",
                "activities": "gardening, cooking, music, romance, high quality clothes, working with hands",
                "cheer1": "You are very loyal to those that you know and you will maintain a strong connection with them throughout your life!",
                "cheer2": "You will always work harder at what you do for a living even if it is just a little bit more money in your pockets!"
            },
            "gemini": {
                "emoji": "👯",
                "range": "May 21 - June 20",
                "numbers": "5, 7, 14, 23",
                "strengths": "gentle, affectionate, curious, adaptable, ability to learn quickly and exchange ideas",
                "activities": "music, books, magazines, chats with nearly anyone, short trips around the town",
                "cheer1": "You will have a lot social contacts and always maintain a strong wilingness to interact with the young ones!",
                "cheer2": "You will always try to take on tasks that challenge your mind and connect you with others!"
            },
            "cancer": {
                "emoji": "🦀",
                "range": "June 21 - July 22",
                "numbers": "2, 3, 15, 20",
                "strengths": "tenacious, highly imaginative, loyal, emotional, sympathetic, persuasive",
                "activities": "art, home-based hobbies, relaxing near or in water, helping loved ones, a good meal with friends",
                "cheer1": "You love socializing in your home environment - it's how close relationships will form!",
                "cheer2": "Although you are uncomfortable around people you are familiar with, you will nevertheless perform a great job on whatever you do with your dedication and thoroughness!"
            },
            "leo": {
                "emoji": "🦁",
                "range": "July 23 - August 22",
                "numbers": "1, 3, 10, 19",
                "strengths": "creative, passionate, generous, warm-hearted, cheerful, humorous",
                "activities": "theater, taking holidays, being admired, expensive things, bright colors, fun with friends",
                "cheer1": "You are very generous and faithful, which is why you will always do what it takes to help others!",
                "cheer2": "With your dedicative and creative personality, you will manage amazingly on your own in any task without outside guidiance!"
            },
            "virgo": {
                "emoji": "🐓",
                "range": "August 23 - September 22",
                "numbers": "5, 14, 15, 23, 32",
                "strengths": "loyal, analytical, kind, hardworking, practical",
                "activities": "animals, healthy food, books, nature, cleanliness",
                "cheer1": "You are an amazing problem-solver and will make an excellent advisor.",
                "cheer2": "Your well thought-out methology will allow you shine at any task you do."
            },
            "libra": {
                "emoji": "⚖️",
                "range": "September 23 - October 22",
                "numbers": "4, 6, 13, 15, 24",
                "strengths": "cooperative,diplomatic, gracious, fair-minded, social",
                "activities": "harmony, gentleness, sharing with others, the outdoors",
                "cheer1": "Although you may always want to stand out in your social circle, you will always be invested in forming connections with people who show interest in you and think in the similar way as you.",
                "cheer2": "You will always try to balance your personal time and work time, and when deciding between two things, whether abstract or concrete, you will always try to be fair in your decisions."
            },
            "scorpio": {
                "emoji": "🦂",
                "range": "October 23 - November 21",
                "numbers": "8, 11, 18, 22",
                "strengths": "resourceful, brave, passionate, stubborn, a true friend",
                "activities": "truth, facts, being right, longtime friends, teasing, a grand passion",
                "cheer1": "You are very hinest and fair when it comes to being friends with other people and these two qualities will build a very solid social circle around you!",
                "cheer2": "You love setting goals for yourself and you will never give up until you reach that goal, even if it seems quite impossible at times!"
            },
            "sagittarius": {
                "emoji": "🐎",
                "range": "November 22 - December 21",
                "numbers": "3, 7, 9, 12, 21",
                "strengths": "generous, idealistic, great sense of humor",
                "activities": "freedom, travel, philosophy, being outdoors",
                "cheer1": "You will always be surrounded by friends because of your great humor; people will easily wram up to you!",
                "cheer2": "You alwyas know how to respond in any situation and you would do anything to achieve your goal, especially if it requires to mover around places often."
            },
            "capricorn": {
                "emoji": "🐐",
                "range": "December 22 - January 19",
                "numbers": "4, 8, 13, 22",
                "strengths": "responsible, disciplined, self-control, good managers",
                "activities": "family, tradition, music, understated status, quality craftsmanship",
                "cheer1": "Although your social circle will be small, you will be surrounded by very supportive people that clearly understands your boundaries and goals!",
                "cheer2": "You are always decidated in what you do, and it is your hardwork and concentration that will help you pull through whatever task placed in front of you!"
            }
        };
    }
}
let GLOBALS = new Globals;