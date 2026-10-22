import express from 'express';

const router = express.Router();

// POST /shipping/calculate-rate
router.post('/shipping/calculate-rate', (req, res) => {
  const {
    sourcePincode = '400001',
    destPincode = '400053',
    weightGrams = 500,
    isPrimeMember = false,
    cartAmountInPaise = 0,
  } = req.body;

  const sourceZone = sourcePincode.substring(0, 2);
  const destZone = destPincode.substring(0, 2);
  const isSameZone = sourceZone === destZone;

  const estimatedDays = isSameZone ? (isPrimeMember ? 1 : 2) : isPrimeMember ? 2 : 4;

  let shippingFeeInPaise = 0;
  if (isPrimeMember || cartAmountInPaise >= 49900) {
    shippingFeeInPaise = 0;
  } else {
    shippingFeeInPaise = isSameZone ? 4900 : 7900;
  }

  const estDate = new Date();
  estDate.setDate(estDate.getDate() + estimatedDays);

  res.json({
    success: true,
    data: {
      sourcePincode,
      destPincode,
      isSameZone,
      estimatedDays,
      shippingFeeInPaise,
      courierPartner: 'Delhivery Surface & Air',
      estimatedDeliveryDate: estDate.toISOString(),
      freeDeliveryThresholdInPaise: 49900,
    },
    timestamp: new Date().toISOString(),
  });
});

// POST /tax/calculate
router.post('/tax/calculate', (req, res) => {
  const { grossAmountInPaise, taxRatePercent = 18.0, sellerState = 'Maharashtra', customerState = 'Maharashtra' } = req.body;

  const gross = Number(grossAmountInPaise) || 0;
  const isInterState = sellerState.toLowerCase() !== customerState.toLowerCase();

  const netAmount = Math.round(gross / (1 + taxRatePercent / 100));
  const totalTax = gross - netAmount;

  res.json({
    success: true,
    data: {
      grossAmountInPaise: gross,
      netAmountInPaise: netAmount,
      totalTaxInPaise: totalTax,
      isInterState,
      igstInPaise: isInterState ? totalTax : 0,
      cgstInPaise: isInterState ? 0 : Math.round(totalTax / 2),
      sgstInPaise: isInterState ? 0 : totalTax - Math.round(totalTax / 2),
      taxRatePercent,
    },
    timestamp: new Date().toISOString(),
  });
});

export default router;
