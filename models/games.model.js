import mongoose from "mongoose";
const { Schema } = mongoose;

const developerSchema = new Schema({
  name: { type: String, required: true },
  code: { type: String, required: true },
  restricted_territories: { type: [String], required: true },
});

const gameSchema = new Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  enabled: { type: Boolean, required: true },
  developer: { type: String, required: true },
  bonus_types: {
    type: [String],
    required: true,
    enum: ["free_bets", "free_money", "bonus_game"],
  },
  category: { type: String, required: true },
  themes: { type: [String], required: true },
  features: { type: [String], required: true },
  rtp: { type: String, required: false },
  volatility: {
    type: Number,
    required: false,
    enum: [1, 2, 3, 4, 5],
  },
  max_payout_coeff: { type: String, required: true },
  hit_ratio: { type: String, required: true },
  fun_mode: { type: Boolean, required: true },
  release_date: { type: Date, required: false },
  deprecation_date: { type: Date, required: false },
});

const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
    enum: [
      "Live Lottery", "Live Poker", "Live Roulette", "Live Sic Bo", "Game Show", 
      "Live Baccarat", "Live Blackjack", "Money Wheel", "Live Dealer", "Live Dragon Tiger", 
      "Live Lobby", "Top Card", "Table Games", "Scratch Card", "Baccarat", 
      "Blackjack", "Casual Games", "Craps", "Crash Games", "Dragon Tiger", 
      "Lobby", "Lottery", "Roulette", "Video Slots", "Fishing Games", 
      "Virtual Sports", "Poker", "Sportsbook"
    ],
  },
  type: {
    type: String,
    required: true,
    enum: ["live_dealer", "rng", "sportsbook"],
  },
});

const mainSchema = new Schema({
  status: {
    type: String,
    required: true,
    enum: ["ok", "error"],
  },
  games: { type: [gameSchema], required: true },
  developers: { type: [developerSchema], required: true },
  categories: { type: [categorySchema], required: true },
});

const errorSchema = new Schema({
  status: {
    type: String,
    required: true,
    enum: ["ok", "error"],
  },
  reason: { type: String, required: true },
});

export const MainModel = mongoose.model('Main', mainSchema);
const ErrorModel = mongoose.model('Error', errorSchema);



