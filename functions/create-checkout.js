const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event, context) => {
    const { items } = JSON.parse(event.body);

    const line_items = items.map(item => ({
        price_data: {
            currency: "usd",
            product_data: { name: item.name },
            unit_amount: item.price * 100,
        },
        quantity: 1,
    }));

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items,
            mode: "payment",
            success_url: "https://yourdomain.com/success.html",
            cancel_url: "https://yourdomain.com/cancel.html",
        });

        return { statusCode: 200, body: JSON.stringify({ url: session.url }) };
    } catch (err) {
        return { statusCode: 500, body: err.toString() };
    }
};
