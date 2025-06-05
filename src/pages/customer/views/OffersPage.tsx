import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Paper,
  LinearProgress,
  useMediaQuery,
  useTheme,
  Stack,
  Divider,
} from "@mui/material";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import StarIcon from "@mui/icons-material/Star";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import { formatPrice } from "../../../utils/foodHelpers";

const mockOffers = [
  {
    id: "1",
    title: "50% OFF Pizza Palace",
    description: "Get 50% off on all pizzas. Valid until midnight!",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400",
    discount: "50%",
    validUntil: "Tonight",
    restaurantName: "Pizza Palace",
    minOrder: 15.00,
    maxDiscount: 10.00,
    isExpiring: true,
    category: "Pizza"
  },
  {
    id: "2", 
    title: "Free Delivery Weekend",
    description: "Free delivery on all orders above $20. No delivery fees!",
    image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400",
    discount: "Free Delivery",
    validUntil: "2 days",
    restaurantName: "All Restaurants",
    minOrder: 20.00,
    maxDiscount: 5.00,
    isExpiring: false,
    category: "Delivery"
  },
  {
    id: "3",
    title: "Buy 1 Get 1 Sushi",
    description: "Order any sushi roll and get another one absolutely free!",
    image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400", 
    discount: "BOGO",
    validUntil: "3 days",
    restaurantName: "Sushi Express",
    minOrder: 25.00,
    maxDiscount: 15.00,
    isExpiring: false,
    category: "Japanese"
  },
  {
    id: "4",
    title: "Healthy Monday Deal",
    description: "25% off on all healthy bowls and salads. Start your week right!",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400",
    discount: "25%",
    validUntil: "5 hours", 
    restaurantName: "Healthy Bowls",
    minOrder: 12.00,
    maxDiscount: 8.00,
    isExpiring: true,
    category: "Healthy"
  },
  {
    id: "5",
    title: "Taco Tuesday Special",
    description: "3 tacos for the price of 2! Every Tuesday is taco day.",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400",
    discount: "33%",
    validUntil: "Today",
    restaurantName: "Taco Fiesta", 
    minOrder: 8.00,
    maxDiscount: 6.00,
    isExpiring: true,
    category: "Mexican"
  },
  {
    id: "6",
    title: "First Order Bonus",
    description: "New customers get 30% off their first order. Welcome to FoodEase!",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400",
    discount: "30%",
    validUntil: "Ongoing",
    restaurantName: "All Restaurants",
    minOrder: 10.00,
    maxDiscount: 12.00,
    isExpiring: false,
    category: "New User"
  }
];

const OffersPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));

  const expiringOffers = mockOffers.filter(offer => offer.isExpiring);
  const regularOffers = mockOffers.filter(offer => !offer.isExpiring);

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: theme.palette.grey[50] }}>
      {/* Header */}
      <Box sx={{ 
        backgroundColor: "white", 
        borderBottom: 1, 
        borderColor: "divider", 
        py: { xs: 3, md: 4 } 
      }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center" }}>
            <LocalOfferIcon sx={{ 
              fontSize: { xs: 40, md: 48 }, 
              color: theme.palette.primary.main, 
              mb: 2 
            }} />
            <Typography 
              variant={isMobile ? "h4" : "h3"} 
              fontWeight="bold" 
              gutterBottom
            >
              Special Offers
            </Typography>
            <Typography 
              variant={isMobile ? "body1" : "h6"} 
              color="text.secondary"
              sx={{ maxWidth: 600, mx: "auto", px: { xs: 2, md: 0 } }}
            >
              Save more with our exclusive deals and promotions
            </Typography>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 3, md: 4 } }}>
        {/* Expiring Soon Section */}
        {expiringOffers.length > 0 && (
          <Box sx={{ mb: { xs: 4, md: 6 } }}>
            <Box sx={{ 
              display: "flex", 
              alignItems: "center", 
              mb: 3,
              px: { xs: 1, md: 0 }
            }}>
              <AccessTimeIcon sx={{ mr: 1, color: theme.palette.error.main }} />
              <Typography 
                variant={isMobile ? "h5" : "h4"} 
                fontWeight="bold" 
                color="error.main"
              >
                Expiring Soon!
              </Typography>
            </Box>
            <Typography 
              variant="body1" 
              color="text.secondary" 
              sx={{ mb: 3, px: { xs: 1, md: 0 } }}
            >
              Hurry up! These offers won't last long.
            </Typography>

            <Grid container spacing={{ xs: 2, sm: 3 }}>
              {expiringOffers.map((offer) => (
                <Grid item xs={12} sm={6} md={4} key={offer.id}>
                  <Card 
                    sx={{ 
                      height: "100%", 
                      display: "flex", 
                      flexDirection: "column",
                      border: `2px solid ${theme.palette.error.main}`,
                      position: "relative",
                      borderRadius: 2,
                      "&:hover": {
                        transform: "translateY(-4px)",
                        transition: "transform 0.3s ease",
                        boxShadow: theme.shadows[8],
                      }
                    }}
                  >
                    {/* Expiring Badge */}
                    <Chip
                      label="Expiring Soon!"
                      color="error"
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        zIndex: 1,
                        fontWeight: "bold",
                      }}
                    />

                    <CardMedia
                      component="img"
                      height={isMobile ? "160" : "180"}
                      image={offer.image}
                      alt={offer.title}
                      sx={{ objectFit: "cover" }}
                    />
                    
                    <CardContent sx={{ flex: 1, p: { xs: 2, md: 2.5 } }}>
                      <Box sx={{ 
                        display: "flex", 
                        alignItems: "flex-start", 
                        justifyContent: "space-between", 
                        mb: 1,
                        gap: 1
                      }}>
                        <Typography 
                          variant={isMobile ? "subtitle1" : "h6"} 
                          fontWeight="600" 
                          sx={{ flex: 1, lineHeight: 1.3 }}
                        >
                          {offer.title}
                        </Typography>
                        <Chip 
                          label={offer.discount}
                          color="primary"
                          variant="filled"
                          size="small"
                          sx={{ fontWeight: "bold" }}
                        />
                      </Box>

                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ 
                          mb: 2,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {offer.description}
                      </Typography>

                      <Stack spacing={1} sx={{ mb: 2 }}>
                        <Typography variant="caption" color="text.secondary">
                          Restaurant: {offer.restaurantName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Min Order: {formatPrice(offer.minOrder)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Max Discount: {formatPrice(offer.maxDiscount)}
                        </Typography>
                      </Stack>

                      <Divider sx={{ my: 1.5 }} />

                      <Box sx={{ 
                        display: "flex", 
                        justifyContent: "space-between", 
                        alignItems: "center",
                        flexDirection: { xs: "column", sm: "row" },
                        gap: 1
                      }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          <AccessTimeIcon 
                            sx={{ 
                              fontSize: "small", 
                              color: theme.palette.error.main 
                            }} 
                          />
                          <Typography 
                            variant="caption" 
                            color="error.main" 
                            fontWeight="bold"
                          >
                            {offer.validUntil}
                          </Typography>
                        </Box>
                        
                        <Chip 
                          label={offer.category}
                          variant="outlined"
                          size="small"
                          sx={{ fontSize: "0.7rem" }}
                        />
                      </Box>

                      <Button
                        fullWidth
                        variant="contained"
                        color="error"
                        sx={{ 
                          mt: 2, 
                          borderRadius: 2,
                          textTransform: "none",
                          fontWeight: "bold"
                        }}
                      >
                        Claim Offer
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Regular Offers Section */}
        <Box>
          <Box sx={{ 
            display: "flex", 
            alignItems: "center", 
            mb: 3,
            px: { xs: 1, md: 0 }
          }}>
            <LocalOfferIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
            <Typography 
              variant={isMobile ? "h5" : "h4"} 
              fontWeight="bold" 
              color="primary.main"
            >
              All Offers
            </Typography>
          </Box>
          <Typography 
            variant="body1" 
            color="text.secondary" 
            sx={{ mb: 3, px: { xs: 1, md: 0 } }}
          >
            Discover more amazing deals and save on your favorite meals.
          </Typography>

          <Grid container spacing={{ xs: 2, sm: 3 }}>
            {regularOffers.map((offer) => (
              <Grid item xs={12} sm={6} md={4} key={offer.id}>
                <Card 
                  sx={{ 
                    height: "100%", 
                    display: "flex", 
                    flexDirection: "column",
                    borderRadius: 2,
                    "&:hover": {
                      transform: "translateY(-4px)",
                      transition: "transform 0.3s ease",
                      boxShadow: theme.shadows[6],
                    }
                  }}
                >
                  <CardMedia
                    component="img"
                    height={isMobile ? "160" : "180"}
                    image={offer.image}
                    alt={offer.title}
                    sx={{ objectFit: "cover" }}
                  />
                  
                  <CardContent sx={{ flex: 1, p: { xs: 2, md: 2.5 } }}>
                    <Box sx={{ 
                      display: "flex", 
                      alignItems: "flex-start", 
                      justifyContent: "space-between", 
                      mb: 1,
                      gap: 1
                    }}>
                      <Typography 
                        variant={isMobile ? "subtitle1" : "h6"} 
                        fontWeight="600" 
                        sx={{ flex: 1, lineHeight: 1.3 }}
                      >
                        {offer.title}
                      </Typography>
                      <Chip 
                        label={offer.discount}
                        color="primary"
                        variant="filled"
                        size="small"
                        sx={{ fontWeight: "bold" }}
                      />
                    </Box>

                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ 
                        mb: 2,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {offer.description}
                    </Typography>

                    <Stack spacing={1} sx={{ mb: 2 }}>
                      <Typography variant="caption" color="text.secondary">
                        Restaurant: {offer.restaurantName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Min Order: {formatPrice(offer.minOrder)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Max Discount: {formatPrice(offer.maxDiscount)}
                      </Typography>
                    </Stack>

                    <Divider sx={{ my: 1.5 }} />

                    <Box sx={{ 
                      display: "flex", 
                      justifyContent: "space-between", 
                      alignItems: "center",
                      flexDirection: { xs: "column", sm: "row" },
                      gap: 1
                    }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <AccessTimeIcon 
                          sx={{ 
                            fontSize: "small", 
                            color: theme.palette.primary.main 
                          }} 
                        />
                        <Typography 
                          variant="caption" 
                          color="primary.main" 
                          fontWeight="bold"
                        >
                          {offer.validUntil}
                        </Typography>
                      </Box>
                      
                      <Chip 
                        label={offer.category}
                        variant="outlined"
                        size="small"
                        sx={{ fontSize: "0.7rem" }}
                      />
                    </Box>

                    <Button
                      fullWidth
                      variant="contained"
                      sx={{ 
                        mt: 2, 
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: "bold"
                      }}
                    >
                      Get Offer
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Call to Action */}
        <Paper
          sx={{
            mt: 6,
            p: 4,
            textAlign: "center",
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            color: "white",
          }}
        >
          <DeliveryDiningIcon sx={{ fontSize: 48, mb: 2 }} />
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Want More Exclusive Deals?
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
            Download our mobile app and get notified about flash sales and exclusive app-only offers!
          </Typography>
          <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
            <Button
              variant="contained"
              size="large"
              sx={{ 
                backgroundColor: "white", 
                color: theme.palette.primary.main,
                "&:hover": { backgroundColor: theme.palette.grey[100] }
              }}
            >
              Download App
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{ 
                borderColor: "white", 
                color: "white",
                "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" }
              }}
            >
              Subscribe to Newsletter
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default OffersPage; 