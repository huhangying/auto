var newsSchema = global.mongoose.Schema({
        id: String,
        title: String,
        cat: String,
        from: String,
        date: { type: Date },
        href: String,
        count: { type: Number, default: 0 },
        loaded: { type: Boolean },
        content: { type: String },
        hasSiblings: {type: Boolean},
        siblingNum: { type: Number },
        siblindId: { type: String }
    }
    // , {
    //     timestamps: true
    // }
);


module.exports = global.mongoose.model('news', newsSchema);