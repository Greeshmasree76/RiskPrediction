def to_bool(value):
    if isinstance(value, bool):
        return value

    if isinstance(value, str):
        return value.lower() in ["true", "1", "yes"]

    return bool(value)


def classify_robson_group(patient):
    parity = int(patient.get("parity", 0))
    gestational_age = int(patient.get("gestationalAge", 0))
    previous_lscs = to_bool(patient.get("previousLSCS", False))
    number_of_fetuses = patient.get("numberOfFetuses", "")
    presentation = patient.get("presentation", "")
    fetal_lie = patient.get("fetalLie", "")
    labour_type = patient.get("labourType", "")
    delivery_timing = patient.get("deliveryTiming", "")

    if number_of_fetuses == "Multiple":
        return 8, "Multiple pregnancy"

    if (
        fetal_lie in ["Transverse", "Oblique"]
        or presentation in ["Transverse", "Oblique"]
    ):
        return 9, "Single pregnancy with transverse or oblique lie"

    if presentation == "Breech" and parity == 0:
        return 6, "Nulliparous woman with single breech pregnancy"

    if presentation == "Breech" and parity >= 1:
        return 7, "Multiparous woman with single breech pregnancy"

    if (
        previous_lscs is True
        and number_of_fetuses == "Single"
        and presentation == "Cephalic"
        and gestational_age >= 37
    ):
        return 5, "Previous cesarean section, single cephalic pregnancy, term"

    if (
        number_of_fetuses == "Single"
        and presentation == "Cephalic"
        and gestational_age < 37
    ):
        return 10, "Single cephalic pregnancy, preterm"

    if (
        parity == 0
        and number_of_fetuses == "Single"
        and presentation == "Cephalic"
        and gestational_age >= 37
        and labour_type == "Spontaneous"
    ):
        return 1, "Nulliparous, single cephalic pregnancy, term, spontaneous labour"

    if (
        parity == 0
        and number_of_fetuses == "Single"
        and presentation == "Cephalic"
        and gestational_age >= 37
        and (labour_type == "Induced" or delivery_timing == "Pre Labour CS")
    ):
        return 2, "Nulliparous, single cephalic pregnancy, term, induced labour or pre-labour CS"

    if (
        parity >= 1
        and previous_lscs is False
        and number_of_fetuses == "Single"
        and presentation == "Cephalic"
        and gestational_age >= 37
        and labour_type == "Spontaneous"
    ):
        return 3, "Multiparous without previous CS, single cephalic pregnancy, term, spontaneous labour"

    if (
        parity >= 1
        and previous_lscs is False
        and number_of_fetuses == "Single"
        and presentation == "Cephalic"
        and gestational_age >= 37
        and (labour_type == "Induced" or delivery_timing == "Pre Labour CS")
    ):
        return 4, "Multiparous without previous CS, single cephalic pregnancy, term, induced labour or pre-labour CS"

    return 10, "Unclassified case assigned to Group 10 fallback"


def calculate_risk(patient, robson_group):
    score = 0

    age = int(patient.get("age", 0))
    gestational_age = int(patient.get("gestationalAge", 0))
    previous_cs_count = int(patient.get("previousCSCount", 0))

    diabetes = to_bool(patient.get("diabetes", False))
    hypertension = to_bool(patient.get("hypertension", False))

    if robson_group == 5:
        score += 5

    if robson_group in [6, 7]:
        score += 4

    if robson_group == 8:
        score += 3

    if robson_group == 9:
        score += 5

    if robson_group == 10:
        score += 2

    if robson_group in [2, 4]:
        score += 2

    if age >= 35:
        score += 2

    if gestational_age > 40:
        score += 2

    if previous_cs_count >= 2:
        score += 2

    if diabetes:
        score += 2

    if hypertension:
        score += 2

    if score >= 7:
        return "High C-Section Risk", score

    if score >= 4:
        return "Moderate C-Section Risk", score

    return "Normal Delivery Likely", score