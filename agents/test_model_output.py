import unittest

from agents.model_output import StructuredModelOutputError, validate_business_plan


def valid_plan():
    return {
        "market_opportunity": "Concrete demand exists.",
        "competitive_landscape": "Existing products leave a gap.",
        "revenue_models": "Charge for a paid tier.",
        "user_acquisition": "Start with creator partnerships.",
        "risk_analysis": "Validate willingness to pay.",
        "executive_summary": "A focused product for a defined buyer.",
        "confidence_score": 78,
        "recommended_next_steps": ["Interview buyers", "Test pricing", "Ship a narrow MVP"],
    }


class ModelOutputTests(unittest.TestCase):
    def test_validates_complete_plan(self):
        result = validate_business_plan(valid_plan())
        self.assertEqual(result["confidence_score"], 78)
        self.assertEqual(len(result["recommended_next_steps"]), 3)

    def test_rejects_missing_and_invalid_fields(self):
        missing = valid_plan()
        del missing["risk_analysis"]
        with self.assertRaises(StructuredModelOutputError):
            validate_business_plan(missing)

        invalid = valid_plan()
        invalid["confidence_score"] = 101
        with self.assertRaisesRegex(StructuredModelOutputError, "confidence_score"):
            validate_business_plan(invalid)

        invalid_steps = valid_plan()
        invalid_steps["recommended_next_steps"] = ["Only one"]
        with self.assertRaisesRegex(StructuredModelOutputError, "recommended_next_steps"):
            validate_business_plan(invalid_steps)


if __name__ == "__main__":
    unittest.main()
