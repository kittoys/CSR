DROP PROCEDURE IF EXISTS sp_add_dummy_forecast_proposals;
DELIMITER $$

CREATE PROCEDURE sp_add_dummy_forecast_proposals()
BEGIN
  DECLARE v_year INT DEFAULT 2023;
  DECLARE v_target INT;
  DECLARE v_serial INT;
  DECLARE v_days_in_year INT;
  DECLARE v_org_index INT;
  DECLARE v_case_id VARCHAR(50);
  DECLARE v_proposal_name VARCHAR(255);
  DECLARE v_organization VARCHAR(255);
  DECLARE v_pic_name VARCHAR(255);
  DECLARE v_pic_email VARCHAR(255);
  DECLARE v_proposal_date DATE;
  DECLARE v_day_offset INT;

  WHILE v_year <= 2025 DO
    IF v_year = 2023 THEN
      SET v_target = 370;
      SET v_days_in_year = 365;
    ELSEIF v_year = 2024 THEN
      SET v_target = 400;
      SET v_days_in_year = 366;
    ELSE
      SET v_target = 430;
      SET v_days_in_year = 365;
    END IF;

    SET v_serial = 1;

    WHILE v_serial <= v_target DO
      SET v_case_id = CONCAT('CSR-', v_year, '-TEST-', LPAD(v_serial, 4, '0'));
      SET v_proposal_name = CONCAT('Proposal Bantuan Air Masyarakat ', LPAD(v_serial, 4, '0'));
      SET v_org_index = ((v_serial - 1) MOD 8) + 1;

      SET v_organization = ELT(v_org_index,
        'Warga Desa',
        'Karang Taruna',
        'Yayasan Maju Bersama',
        'Komunitas Peduli Anak',
        'Panti Asuhan Harapan Baru',
        'Rumah Singgah Cahaya',
        'Relawan Peduli Lansia',
        'Yayasan Pendidikan Islam Terpadu'
      );

      SET v_pic_name = ELT(v_org_index,
        'Pak Ilham',
        'Bu Sarah',
        'Pak Ahmad',
        'Bu Siti',
        'Pak Budi',
        'Bu Lina',
        'Pak Hendra',
        'Bu Nabila'
      );

      SET v_pic_email = CONCAT('admin', v_org_index, '@csr.com');
      SET v_day_offset = (v_serial - 1) MOD v_days_in_year;
      SET v_proposal_date = DATE_ADD(CONCAT(v_year, '-01-01'), INTERVAL v_day_offset DAY);

      INSERT IGNORE INTO donation_proposals
        (case_id, proposal_name, organization, product_detail, budget, status, pic_name, pic_email, proposal_date)
      VALUES
        (v_case_id, v_proposal_name, v_organization,
         '2 Dus Aqua 330ml, 5 Dus Aqua 600ml', 500000, 'Done',
         v_pic_name, v_pic_email, v_proposal_date);

      SET v_serial = v_serial + 1;
    END WHILE;

    SET v_year = v_year + 1;
  END WHILE;
END$$

DELIMITER ;

CALL sp_add_dummy_forecast_proposals();
SELECT COUNT(*) AS total_rows, MIN(proposal_date) AS min_date, MAX(proposal_date) AS max_date FROM donation_proposals;
