const {
    Order,
    OrderItem,
    Payment,
    TicketType,
    Event,
    Ticket
} = require("../../../models");

const { Op } = require("sequelize");
const { maskEmail } = require("../../../utils/maskEmail");
const { maskPhone } = require("../../../utils/maskPhone");
const { toWIB } = require("../../utils/wib");

function buildDateRange(start_date, end_date) {
    if (!start_date || !end_date || start_date === "null" || end_date === "null") {
        return {};
    }

    return {
        created_at: {
            [Op.between]: [
                `${start_date} 00:00:00`,
                `${end_date} 23:59:59`
            ],
        },
    };
}

module.exports = {

    async getPagination({
        page,
        perPage,
        search,
        status,
        payment_method,
        creator_id,
        event_id,
        start_date,
        end_date
    }) {

        const limit = Number(perPage) || 10;
        const offset = (Number(page) - 1) * limit;

        const where = {
            creator_id,

            ...(status && status !== "ALL"
                ? { status: status.toLowerCase() }
                : {}),

            ...buildDateRange(start_date, end_date),
        };

        if (search) {
            where[Op.or] = [
                { code_order: { [Op.like]: `%${search}%` } },
                { customer_name: { [Op.like]: `%${search}%` } },
                { customer_email: { [Op.like]: `%${search}%` } },
                { customer_phone: { [Op.like]: `%${search}%` } },
            ];
        }

        const include = [

            // ITEMS
            {
                model: OrderItem,
                as: "items",
                required: false,

                include: [

                    {
                        model: TicketType,
                        as: "ticket_type",
                        required: false,

                        include: [

                            {
                                model: Event,
                                as: "event",

                                required:
                                    !!event_id &&
                                    event_id !== "ALL",

                                where:
                                    event_id &&
                                        event_id !== "ALL"
                                        ? { id: event_id }
                                        : undefined
                            }

                        ]
                    },

                    {
                        model: Ticket,
                        as: "tickets",
                        required: false,

                        attributes: [
                            "ticket_code",
                            "issued_at",
                            "sent_at"
                        ]
                    }

                ]
            },

            // PAYMENT
            {
                model: Payment,
                as: "payments",

                required:
                    !!payment_method &&
                    payment_method !== "ALL",

                where:
                    payment_method &&
                        payment_method !== "ALL"
                        ? { payment_method }
                        : undefined,

                attributes: [
                    "payment_method",
                    "status",
                    "amount",
                    "paid_at"
                ]
            }

        ];

        const { rows, count } =
            await Order.findAndCountAll({

                where,

                include,

                distinct: true,

                order: [
                    ["created_at", "DESC"]
                ],

                limit,

                offset
            });

        // =====================
        // SUMMARY
        // =====================

        const summaryRows =
            await Order.findAll({

                where,

                include,

                distinct: true
            });

        let totalTicketQty = 0;
        let totalRevenue = 0;
        let totalOrganizerNet = 0;

        summaryRows.forEach(order => {

            totalRevenue +=
                Number(order.buyer_pay_total || 0);

            totalOrganizerNet +=
                Number(order.organizer_net_total || 0);

            totalTicketQty +=
                order.items.reduce(

                    (sum, item) =>
                        sum + Number(item.quantity || 0),

                    0
                );

        });

        // =====================
        // FORMAT RESPONSE
        // =====================

        const formattedRows =
            rows.map(order => {

                const pay =
                    order.payments?.[0] || null;

                // ambil semua event
                const eventNames =
                    order.items
                        ?.map(i =>
                            i.ticket_type?.event?.name
                        )
                        .filter(Boolean);

                return {

                    id: order.id,

                    invoice_no:
                        order.code_order,

                    customer_name:
                        order.customer_name,

                    customer_email:
                        maskEmail(
                            order.customer_email
                        ),

                    customer_phone:
                        maskPhone(
                            order.customer_phone
                        ),

                    event_name:
                        eventNames?.length
                            ? [
                                ...new Set(
                                    eventNames
                                )
                            ].join(", ")
                            : "-",

                    total_amount:
                        Number(
                            order.buyer_pay_total
                        ),

                    organizer_net:
                        Number(
                            order.organizer_net_total
                        ),

                    status:
                        order.status.toUpperCase(),

                    created_at:
                        toWIB(order.created_at),

                    payment:

                        pay
                            ? {

                                method:
                                    pay.payment_method,

                                status:
                                    pay.status.toUpperCase(),

                                amount:
                                    Number(pay.amount),

                                paid_at:

                                    pay.paid_at
                                        ? toWIB(pay.paid_at)
                                        : null,

                            }
                            : null,

                };

            });

        return {

            rows:
                formattedRows,

            count,

            page:
                Number(page),

            perPage:
                limit,

            totalPages:
                Math.ceil(count / limit),

            summary: {

                total_orders:
                    summaryRows.length,

                total_ticket_qty:
                    totalTicketQty,

                total_revenue:
                    totalRevenue,

                total_organizer_net:
                    totalOrganizerNet,

            }

        };

    },

    async getDetail(order_id, creator_id) {
        const order = await Order.findOne({
            where: { id: order_id, creator_id },
            include: [
                {
                    model: OrderItem,
                    as: "items",
                    include: [
                        {
                            model: TicketType,
                            as: "ticket_type",
                            include: [{ model: Event, as: "event" }],
                        },
                        {
                            model: Ticket,
                            as: "tickets",
                            attributes: [
                                "ticket_code",
                                "owner_name",
                                "owner_email",
                                "status",
                                "issued_at",
                                "sent_at",
                            ],
                        },
                    ],
                },
                {
                    model: Payment,
                    as: "payments",
                    attributes: ["payment_method", "status", "amount", "paid_at"],
                },
            ],
        });

        if (!order) throw new Error("Order not found");

        const pay = order.payments?.[0] ?? null;

        const totalTicketQty = order.items.reduce((sum, i) => sum + Number(i.quantity), 0);
        const totalTicketTypes = order.items.length;

        const financeSummary = {
            ticket_subtotal: Number(order.ticket_subtotal),
            admin_fee_total: Number(order.admin_fee_amount),
            tax_total: Number(order.tax_amount),
            grand_total: Number(order.buyer_pay_total),
        };

        const allTickets = order.items.flatMap(i => i.tickets);

        const firstIssued = allTickets
            .filter(t => t.issued_at)
            .sort((a, b) => new Date(a.issued_at) - new Date(b.issued_at))[0];

        const firstSent = allTickets
            .filter(t => t.sent_at)
            .sort((a, b) => new Date(a.sent_at) - new Date(b.sent_at))[0];

        const timeline = [
            {
                key: "created",
                label: "Order Created",
                date: toWIB(order.created_at),
                active: true,
            },
            ...(order.status === "waiting_payment"
                ? [{
                    key: "waiting_payment",
                    label: "Waiting Payment",
                    date: toWIB(order.created_at),
                    active: true,
                }]
                : []),
            {
                key: "paid",
                label: "Paid",
                date: pay?.status === "paid" ? toWIB(pay.paid_at) : null,
                active: pay?.status === "paid",
            },
            {
                key: "issued",
                label: "Tickets Issued",
                date: firstIssued ? toWIB(firstIssued.issued_at) : null,
                active: !!firstIssued,
            },
            {
                key: "sent",
                label: "Tickets Sent",
                date: firstSent ? toWIB(firstSent.sent_at) : null,
                active: !!firstSent,
            },
        ];

        return {
            id: order.id,
            invoice_no: order.code_order,

            customer_name: order.customer_name,
            customer_email: maskEmail(order.customer_email),
            customer_phone: maskPhone(order.customer_phone),

            total_amount: Number(order.buyer_pay_total),
            organizer_net: Number(order.organizer_net_total),

            status: order.status.toUpperCase(),
            created_at: toWIB(order.created_at),

            event_name: order.items[0]?.ticket_type?.event?.name ?? "-",

            total_ticket_qty: totalTicketQty,
            total_ticket_types: totalTicketTypes,
            finance_summary: financeSummary,

            payment: pay
                ? {
                    method: pay.payment_method,
                    status: pay.status.toUpperCase(),
                    amount: Number(pay.amount),
                    paid_at: pay.paid_at ? toWIB(pay.paid_at) : null,
                }
                : null,

            timeline,

            items: order.items.map((i) => ({
                id: i.id,
                ticket_type_name: i.ticket_type?.name,
                event_name: i.ticket_type?.event?.name,
                quantity: i.quantity,
                ticket_price: Number(i.ticket_price),

                admin_fee: Number(i.admin_fee_amount),
                tax: Number(i.tax_amount),

                total_price: Number(i.buyer_pay_amount),
                organizer_net: Number(i.organizer_net),

                tickets:
                    i.tickets?.map((t) => ({
                        ticket_code: t.ticket_code,
                        owner_name: t.owner_name,
                        owner_email: maskEmail(t.owner_email),
                        status: t.status,
                        issued_at: t.issued_at ? toWIB(t.issued_at) : null,
                        sent_at: t.sent_at ? toWIB(t.sent_at) : null,
                    })) ?? [],
            })),
        };
    },

    async getExportData(params) {
        const { search, status, payment_method, creator_id, event_id, start_date, end_date } = params;

        const where = {
            creator_id,
            ...(status !== "ALL" && status ? { status: status.toLowerCase() } : {}),
            ...buildDateRange(start_date, end_date)
        };

        if (search) {
            where[Op.or] = [
                { code_order: { [Op.like]: `%${search}%` } },
                { customer_name: { [Op.like]: `%${search}%` } },
                { customer_email: { [Op.like]: `%${search}%` } },
                { customer_phone: { [Op.like]: `%${search}%` } },
                { "$items.tickets.ticket_code$": { [Op.like]: `%${search}%` } },
            ];
        }

        if (event_id) {
            where["$items.ticket_type.event.id$"] = event_id;
        }

        if (payment_method && payment_method !== "ALL") {
            where["$payments.payment_method$"] = payment_method;
        }

        const rows = await Order.findAll({
            where,
            include: [
                {
                    model: OrderItem,
                    as: "items",
                    include: [
                        {
                            model: TicketType,
                            as: "ticket_type",
                            include: [{ model: Event, as: "event" }],
                        },
                        {
                            model: Ticket,
                            as: "tickets",
                        },
                    ],
                },
                { model: Payment, as: "payments" },
            ],
            order: [["created_at", "DESC"]],
        });

        const exportRows = [];

        rows.forEach(order => {
            const pay = order.payments?.[0] ?? null;

            order.items.forEach(item => {
                exportRows.push({
                    invoice_no: order.code_order,
                    event_name: item.ticket_type.event.name,
                    ticket_type: item.ticket_type.name,
                    quantity: item.quantity,
                    ticket_price: Number(item.ticket_price),

                    admin_fee_amount: Number(item.admin_fee_amount),
                    tax_amount: Number(item.tax_amount),
                    buyer_pay_amount: Number(item.buyer_pay_amount),

                    total_ticket_qty: item.quantity,
                    total_order: Number(order.buyer_pay_total),

                    customer_name: order.customer_name,
                    customer_email: maskEmail(order.customer_email),

                    payment_method: pay?.payment_method || "-",
                    payment_status: pay?.status?.toUpperCase() || "-",
                    paid_at: pay?.paid_at ? toWIB(pay.paid_at) : "-",

                    created_at: toWIB(order.created_at)
                });
            });
        });

        return exportRows;
    }

};

function extractEventName(order) {
    const events = order.items
        ?.map(i => i.ticket_type?.event?.name)
        .filter(Boolean);

    if (!events?.length) return "-";

    // jika 1 event
    if (events.length === 1) return events[0];

    // jika multi event
    return events.join(", ");
}