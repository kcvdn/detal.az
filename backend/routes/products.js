// GET ALL
router.get("/", async (req, res) => {
  const products = await prisma.product.findMany({
    include: { seller: true }
  });

  res.json(products);
});

// GET ONE
router.get("/:id", async (req, res) => {
  const product = await prisma.product.findUnique({
    where: { id: parseInt(req.params.id) },
    include: { seller: true }
  });

  res.json(product);
});