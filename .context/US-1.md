📝 User Story: Science-Based Calorie Calculator

Title:
Feature: Personalized, Science-Based Calorie Calculation & Recommendation
User Story:
• As a health-conscious user,
• I want to input my biological sex, age, current weight, height, and activity level,
• So that I can receive a science-backed, stress-free calorie target for safe and sustainable weight loss.

⚙️ Acceptance Criteria


1. Data Input Fields

• The system must provide input fields for the following mandatory user parameters:
	• Biological Sex (Selection: Male / Female)
	• Age (in years)
	• Current Weight (in kg or lbs)
	• Height (in cm or inches)
	• Activity Level (Dropdown selection ranging from "Sedentary" to "Highly Active")

2. Calculation Logic (Scientific Framework)

• The system must automatically calculate the Basal Metabolic Rate (BMR) using an established scientific formula (e.g., Mifflin-St Jeor equation).
• The system must multiply the BMR by the corresponding Physical Activity Level (PAL) factor to determine the Total Daily Energy Expenditure (TDEE).
• The system must subtract a stress-free deficit of 300 to 500 kcal from the TDEE to generate the final daily calorie target.

3. Health Safety Guardrails

• Hard Minimum Floor: The system must never recommend a daily budget lower than 1,200 kcal for women or 1,500 kcal for men.
• If a mathematical calculation falls below these thresholds, the system must automatically cap the recommendation at the respective minimum and display a brief health safety notice.

4. Output & User Interface

• The system must display the personalized daily calorie target clearly to the user.
• The UI must include a brief, reassuring explanation stating that this moderate deficit ensures long-term success without starving the body or causing physical stress.
Would you like me to add a Technical Notes section to this story containing the exact mathematical formulas (like the Mifflin-St Jeor equations) and standard PAL multipliers for your development team?

