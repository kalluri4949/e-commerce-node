[
  {
    $match: {
      product: new ObjectId('651d36f5f3ad2e4503142fee'),
    },
  },
  {
    $group: {
      _id: null,
      averageRating: {
        $avg: '$rating',
      },
      numOfReviews: {
        $sum: 1,
      },
    },
  },
];
