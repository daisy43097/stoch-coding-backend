import {Err, HttpCode} from "../helper/Err";
import {User} from "../entity/User";
import {isFullWidth} from "class-validator";

export interface IdCheckRes {
    index: number,
    entities: any[]
}

export class UtilController {
    public static async checkIdExist(ids: number[], repo: any): Promise<IdCheckRes> {
        let index = 0
        let entities = []
        let res: IdCheckRes = {index: -1, entities}

        for(index = 0; index < ids.length; index++) {
            try {
                let entity = await repo.findOneOrFail({where: {id: ids[index]}})
                res.entities.push(entity)
            } catch (e) {
                break
            }
        }

        if (index === ids.length) {
            res.index = -1
        } else {
            res.index = ids[index]
        }

        return res
    }

    public static async validateOrder(userId: number) {
        if (typeof userId !== 'number' || userId <= 0) {
            throw (new Err(HttpCode.E400, 'invalid user id'))
        }

        let res: IdCheckRes

        try {
            let temp = await UtilController.checkIdExist([userId], User)

            if (temp.index !== -1) {
                throw (new Err(HttpCode.E400, `invalid user id ${temp.index}`))
            }
            res = temp
        } catch (e) {
            throw (new Err(HttpCode.E400, 'invalid user id', e))
        }

        return res
    }



    // invoice utilities
    static generateHeader(doc) {
        doc.image('img.png', 50, 45, { width: 50 })
            .fillColor('#444444')
            .fontSize(20)
            .text('Lululemon', 110, 57)
            .fontSize(10)
            .text('123 Main Street', 200, 65, { align: 'right' })
            .text('New York, NY, 10025', 200, 80, { align: 'right' })
            .moveDown();
    }

    static generateFooter(doc) {
        doc.fontSize(
            10,
        ).text(
            'Thank you for shopping with Lululemon!',
            50,
            730,
            { align: 'center', width: 500 },
        );
    }

    static generateCustomerInformation(doc, order) {
        const {payment} = order

        doc
            .fillColor("#444444")
            .fontSize(20)
            .text("Invoice", 50, 160);

        UtilController.generateHr(doc, 185);

        doc.fontSize(10)
            .text(`Invoice Number: ${order.id}`, 50, 200)
            .text(`Invoice Date: ${new Date().toJSON().slice(0,10)}`, 50, 215)
            .text(`Balance Due: ${payment.total}`, 50, 130)

            .text(payment.shipAddress, 300, 215)
            // .text(
            //     `${shipping.city}, ${shipping.state}, ${shipping.country}`,
            //     300,
            //     130,
            // )
            .moveDown();

        UtilController.generateHr(doc, 252);

    }

    static generateTableRow(doc,
                            y,
                            item,
                            color,
                            size,
                            unitCost,
                            quantity,
                            lineTotal) {
        doc
            .fontSize(10)
            .text(item, 50, y, {width: 240})
            .text(color, 300, y, {width: 70})
            .text(size, 380, y)
            .text(unitCost, 410, y, { width: 50, align: "right" })
            .text(quantity, 460, y, { width: 50, align: "right" })
            .text(lineTotal, 50, y, { align: "right" });
    }

    static generateHr(doc, y) {
        doc
            .strokeColor("#aaaaaa")
            .lineWidth(1)
            .moveTo(50, y)
            .lineTo(550, y)
            .stroke();
    }

    static generateInvoiceTable(doc, order) {
        let i;
        const invoiceTableTop = 330;
        const {products} = order

        doc.font("Helvetica-Bold");
        UtilController.generateTableRow(
            doc,
            invoiceTableTop,
            "Item",
            "Color",
            "Size",
            "Unit Cost",
            "Quantity",
            "Line Total"
        );
        UtilController.generateHr(doc, invoiceTableTop + 20);
        doc.font("Helvetica");

        for (i = 0; i < products.length; i++) {
            const item = products[i];
            const position = invoiceTableTop + (i + 1) * 30;
            UtilController.generateTableRow(
                doc,
                position,
                item.title,
                item.color,
                item.size,
                item.price,
                item.quantity,
                '000'
            );

            UtilController.generateHr(doc, position + 20);
        }

        const subtotalPosition = invoiceTableTop + (i + 1) * 30;
        UtilController.generateTableRow(
            doc,
            subtotalPosition,
            "",
            "",
            '',
            "Subtotal",
            "",
            '0000'
        );

        const paidToDatePosition = subtotalPosition + 20;
        UtilController.generateTableRow(
            doc,
            paidToDatePosition,
            "",
            "",
            '',
            "Paid To Date",
            "",
            '00000'
        );

        const duePosition = paidToDatePosition + 25;
        doc.font("Helvetica-Bold");
        UtilController.generateTableRow(
            doc,
            duePosition,
            "",
            "",
            '',
            "Balance Due",
            "",
            '000'
        );
        doc.font("Helvetica");
    }
}