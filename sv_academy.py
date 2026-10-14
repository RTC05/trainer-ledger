"""Base-game academy notebook. Answer keys target the updated English game."""

SEREBII = "https://www.serebii.net/scarletviolet/academyclasses.shtml"
RPG = "https://www.rpgsite.net/feature/13509-pokemon-scarlet-violet-classes-guide-answers-rewards-for-every-class"
CLASSES = "https://gamefaqs.gamespot.com/switch/359435-pokemon-scarlet/faqs/80291/classes"
LESSONS = "https://gamepedia.jp/pokemon-sv/archives/7634"
FRIENDS = "https://www.nintendolife.com/guides/pokemon-scarlet-and-violet-test-answers-all-school-midterm-and-final-exams-teacher-rewards"
EVERSTONE = "https://bulbapedia.bulbagarden.net/wiki/Everstone"

# Short answer cues, in question order. The game supplies the full questions.
SUBJECTS = [
    ("biology", "Biology", "Jacq", 0,
     ["Indoors", "Eggs", "Apply a status condition", "B button", "1 in 4,000", "Rotom"],
     ["ZR", "A + 2 (picnic / basket)", "Walk", "Berry feeding", "Gym badges"],
     ["2", "False", "Yes (updated game)", "1 in 4,000", "False"]),
    ("math", "Math", "Tyme", 0,
     ["Double", "11", "About 4%", "Triple", "Any response", "300"],
     ["Double", "Half", "11", "About 4%", "1.5 times"],
     ["5", "75", "About 12%", "Triple", "2"]),
    ("history", "History", "Raifort", 0,
     ["Treasure", "About 2,000 years", "About 800 years", "Wooden tablets", "Area Zero Expedition", "Sada (Scarlet) / Turo (Violet)"],
     ["Great Crater of Paldea", "Treasure", "About 2,000 years", "805 years", "Knowledge"],
     ["Area Zero", "805 years", "Folding fan", "Heath", "10 years"]),
    ("languages", "Languages", "Salvatore", 2,
     ["Thanks", "Delicious", "Love", "Anger", "Sadness", "Happiness"],
     ["Thank you", "Delicieux", "Time to eat", "Give a compliment", "Salvatore"],
     ["Delicieux", "I love you", "Anger", "Happiness", "Salvatore"]),
    ("battle", "Battle Studies", "Dendra", 0,
     ["Physical and special", "Healing cheer", "Terastallize, then attack", "Any response", "LP", "Flat Rules"],
     ["Special", "Move name", "4", "Terastallize, then attack", "Fighting"],
     ["Go all out!", "Auto Battles", "Material exchange", "50", "True"]),
    ("art", "Art", "Hassel", 2,
     ["Any response", "Grass", "Ice", "Any response", "Glaseado's hand", "Change the title"],
     ["Tera Jewel", "Grass", "Hexagon", "Medali", "No single correct answer"],
     ["Treasure Eatery", "Surrendering Sunflora", "2", "Levincia", "False"]),
    ("home-ec", "Home Ec", "Saguaro", 0,
     ["Fillings and condiments", "Ground pickups", "Moves become unusable", "Arven", "Wash them", "Rotom Phone"],
     ["Speed increase", "Fillings and condiments", "Oran Berry", "True", "False"],
     ["Sparkling Power", "Stronger hatchlings (the NOT-effect)", "Cook together", "Pokemon Wash", "Either choice"]),
]


def build_academy():
    chapter_id = "sv-academy-notebook"
    steps, courses = [], []
    for key, title, teacher, first_badges, lessons, midterm, final in SUBJECTS:
        course_steps = []
        for number in range(1, 7):
            badge_count = first_badges if number < 3 else 3 if number == 3 else 5 if number < 6 else 7
            course_steps.append({
                "id": f"sv-school-{key}-lesson-{number}", "label": f"Lesson {number}",
                "detail": f"Answer cue: {lessons[number - 1]}", "category": "class",
                "badges": badge_count,
            })
            if number in (3, 6):
                exam = "midterm" if number == 3 else "final"
                course_steps.append({
                    "id": f"sv-school-{key}-{exam}", "label": exam.title() + " passed",
                    "detail": "Pass and collect the exam reward at reception.", "category": "exam",
                    "badges": badge_count, "answers": midterm if number == 3 else final,
                })
        courses.append({"name": title, "teacher": teacher, "steps": course_steps})
        steps.extend(course_steps)

    friendships = [
        ("salvatore", "Salvatore: Galarian Meowth", "Complete Languages and his Pawmi conversations; check the staff room for the final gift. This regional form is separate from catching ordinary Meowth."),
        ("tyme", "Tyme: 50 Rock Tera Shards", "Finish Math and follow her student-related conversations, checking the schoolyard for the conclusion."),
        ("hassel", "Hassel: 50 Dragon Tera Shards", "Finish Art and follow his family story through the marked rooms; return to the art room for the conclusion."),
        ("dendra", "Dendra: 10 Protein", "Finish Battle Studies and the sandwich conversations. Follow new room markers after each scene until she gives the reward."),
        ("raifort", "Raifort: shrine locations and Nasty Plot", "Finish History and her conversations to mark the four shrines. Catch Wo-Chien, Chien-Pao, Ting-Lu and Chi-Yu, then report back for TM140."),
        ("saguaro", "Saguaro: Slowpoke Cup", "Finish Home Ec and his conversations. His final request consumes one Sweet Herba Mystica from a suitable high-level raid; the Titan sandwich scenes do not put one in your bag."),
        ("miriam", "Miriam: 10 Max Revives", "Visit the nurse's office during your journey and follow her teaching-exam story. Return after Victory Road if her final conversation is not available yet."),
        ("clavell", "Clavell: Big Nugget", "Visit the director's office for his conversations. Finish Starfall Street and return for the final reward."),
        ("jacq", "Jacq: registration milestones", "In the Biology Lab, report 30 caught species for False Swipe, 100 for 20 Ultra Balls, 200 for 20 Quick Balls and 400 for the Shiny Charm. Claim dex-menu rewards separately."),
    ]
    friend_steps = [{"id": "sv-school-friend-" + key, "label": label, "detail": detail, "category": "school reward"}
                    for key, label, detail in friendships]
    steps.extend(friend_steps)
    return {
        "id": chapter_id, "title": "Academy notebook: classes and friendships",
        "stage": "Reference | return throughout your journey", "objective_kind": "reference",
        "subtitle": "Optional school activities. Open only the subject you are taking; the checkboxes remember your progress.",
        "primary_goal": {"label": "School planner", "title": "Classes, exams and teacher rewards", "detail": "Naranja and Uva use the same base-game class structure."},
        "guide_steps": steps, "pokemon_targets": [],
        "academy": {"courses": courses, "friendships": friend_steps},
        "sources": [
            {"label": "Class unlock schedule", "url": CLASSES},
            {"label": "Lesson answer cross-check", "url": LESSONS},
            {"label": "Exam keys", "url": RPG},
            {"label": "Exam and reward cross-check", "url": SEREBII},
            {"label": "Friendship events", "url": FRIENDS},
            {"label": "Everstone exam update", "url": EVERSTONE},
        ],
    }
