var newsSchema = global.mongoose.Schema({
        id: { type: String},
        title: String,
        cat: { type: String },
        from: String,
        date: { type: Date },
        href: String,
        count: { type: Number, default: 0 },
        loaded: { type: Boolean },
        content: { type: String },
        hasSiblings: {type: Boolean},
        siblingNum: { type: Number },
        siblingId: { type: String }
    },
    {collection: 'news'}
    // , {
    //     timestamps: true
    // }
);


module.exports = global.mongoose.model('news', newsSchema);