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

const MatchController = {
  // Create
  create: async function (req, res) {
    try {
      const matchesData = req.body.matches.map((match) => ({
        clubHome: match.clubHome,
        clubAway: match.clubAway,
        score: {
          homeScore: match.score.homeScore,
          awayScore: match.score.awayScore,
        },
      }));

      // Validasi for each club is homeClub or awayClub only for once per match.
      const clubIds = matchesData.reduce(
        (ids, match) => [...ids, match.clubHome, match.clubAway],
        []
      );
      const uniqueClubIds = [...new Set(clubIds)];

      if (clubIds.length !== uniqueClubIds.length) {
        return res.status(400).json({
          status: "error",
          success: false,
          message: "Each club can only be homeClub or awayClub once per match.",
        });
      }

      const createdMatches = await models.MatchDB.create(matchesData);

      // Looping for updating club stats based on match results
      for (const match of createdMatches) {
        const homeClub = await models.ClubDB.findById(match.clubHome);
        const awayClub = await models.ClubDB.findById(match.clubAway);

        // Update home club stats
        homeClub.matches.push(match._id);
        homeClub.total_goals += match.score.homeScore;
        homeClub.goals_against += match.score.awayScore;
        homeClub.goal_difference +=
          match.score.homeScore - match.score.awayScore;

        // Update away club stats
        awayClub.matches.push(match._id);
        awayClub.total_goals += match.score.awayScore;
        awayClub.goals_against += match.score.homeScore;
        awayClub.goal_difference +=
          match.score.awayScore - match.score.homeScore;

        // Update wins, loses, draws, and total points based on match result
        if (match.score.homeScore > match.score.awayScore) {
          homeClub.wins += 1;
          homeClub.total_points += 3;
          awayClub.loses += 1;
        } else if (match.score.homeScore < match.score.awayScore) {
          homeClub.loses += 1;
          awayClub.wins += 1;
          awayClub.total_points += 3;
        } else {
          homeClub.draws += 1;
          homeClub.total_points += 1;
          awayClub.draws += 1;
          awayClub.total_points += 1;
        }

        await homeClub.save();
        await awayClub.save();
      }

      const responseMatches = createdMatches.map((match) => ({
        ...match.toObject(),
        created_at: match.CreatedAt,
      }));

      return res.status(201).json({
        status: "success",
        success: true,
        message: "Matches created successfully",
        data: responseMatches,
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

  // Detail
  detail: async function (req, res) {
    try {
      const id = req.params.id;

      // Mengembalikan detail match
      const match = await models.MatchDB.findById(id)
        .populate("clubHome", "club_name")
        .populate("clubAway", "club_name");

      if (!match) {
        return res.status(404).json({
          status: "error",
          success: false,
          message: "Match not found",
        });
      }

      // Format the response
      const responseMatch = {
        ...match.toObject(),
        created_at: match.CreatedAt,
      };

      return res.status(200).json({
        status: "success",
        success: true,
        message: "Match details retrieved successfully",
        data: responseMatch,
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

  // Get Post:
  get: async function (req, res) {
    try {
      // Mengembalikan semua matches
      const matches = await models.MatchDB.find()
        .populate("clubHome", "club_name")
        .populate("clubAway", "club_name");

      // Format the response
      const responseMatches = matches.map((match) => ({
        ...match.toObject(),
        created_at: match.CreatedAt,
      }));

      return res.status(200).json({
        status: "success",
        success: true,
        message: "All matches retrieved successfully",
        data: responseMatches,
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

export default MatchController;
