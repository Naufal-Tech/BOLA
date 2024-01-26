import cloudinary from "cloudinary";
import dotenv from "dotenv";
import moment from "moment-timezone";
const defaultDate = () => moment.tz(Date.now(), "Asia/Jakarta").valueOf();
const current_date = moment().tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss");

dotenv.config();
// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const StandingsController = {
  // Create
  get: async function (req, res) {
    try {
      // Retrieve all clubs
      const clubs = await models.ClubDB.find();

      // Calculate standings for each club
      const standings = clubs.map((club) => ({
        club_name: club.club_name,
        wins: club.wins,
        draws: club.draws,
        loses: club.loses,
        total_goals: club.total_goals,
        goals_against: club.goals_against,
        goal_difference: club.goal_difference,
        total_points: club.total_points,
        total_matches: club.matches.length,
      }));

      // Sort standings by total_points and goal_difference
      standings.sort((a, b) => {
        if (a.total_points !== b.total_points) {
          return b.total_points - a.total_points; // Sort by total points
        } else {
          return b.goal_difference - a.goal_difference; // If points are equal, sort by goal difference
        }
      });

      return res.status(200).json({
        status: "success",
        success: true,
        message: "Standings retrieved successfully",
        data: standings,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: "error",
        success: false,
        message: "Internal Server Error",
        error: error.message,
      });
    }
  },
};

export default StandingsController;
