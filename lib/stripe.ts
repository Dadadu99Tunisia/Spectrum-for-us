// Version de démonstration qui ne nécessite pas de clé API Stripe
const mockStripe = {
  checkout: {
    sessions: {
      create: async () => ({
        id: "mock_session_id",
        url: "/panier?demo=true",
      }),
    },
  },
  webhooks: {
    constructEvent: () => ({
      type: "checkout.session.completed",
      data: {
        object: {
          id: "mock_session_id",
          customer_details: {
            email: "demo@example.com",
          },
          metadata: {
            orderId: "demo_order_123",
          },
        },
      },
    }),
  },
}

export default mockStripe

