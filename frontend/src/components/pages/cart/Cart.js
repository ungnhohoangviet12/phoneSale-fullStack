import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import './Cart.scss';
import { AiOutlineLeft, AiFillCaretDown } from "react-icons/ai";
import { IncreaseQuantity, DecreaseQuantity, DeleteCart, totalProduct } from '../../../store/actions/index';
import NumberFormat from 'react-number-format';
import { useNavigate } from "react-router-dom";
import { getAllUCodeService, createCloneUserService } from '../../../services/userService'
const Cart = (props) => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [dataOderProduct, setDataOderProduct] = useState([]);
    const [totalCart, setTotalCart] = useState(0);
    const [gender, setGender] = useState('');
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [provincial, setProvincial] = useState('');
    const [district, setDistrict] = useState('');
    const [wards, setWards] = useState('');
    const [streetName, setStreetName] = useState('');
    const [note, setNote] = useState('');
    //=====================
    const [genderSelect, setGenderSelect] = useState('');

    const fetchAllCode = async (e) => {
        const resGender = await getAllUCodeService('GENDER');
        if (resGender && resGender.errCode === 0) {
            setGenderSelect(resGender.data)
        }
    };
    useEffect(() => {
        let ListCart = []
        let TotalCart = 0;
        let dataOder = []
        const fetch = async () => {
            if (props.productsRedux
                && props.productsRedux.Carts
                && props.productsRedux.Carts.length > 0) {
                const Products = await props.productsRedux.Carts;
                Object.keys(Products).forEach(function (item) {
                    const object = {}
                    TotalCart += Products[item].quantity * Products[item].price;
                    object.quantity = Products[item].quantity
                    object.productId = Products[item].id
                    object.color = Products[item].color
                    dataOder.push(object);
                    ListCart.push(Products[item]);
                });

            }
            setProducts(ListCart);
            setTotalCart(TotalCart);
            setDataOderProduct(dataOder)
        }
        fetch()
        fetchAllCode()
    }, [props]);
    useEffect(() => {
        props.totalProduct(totalCart)
    }, [totalCart])
    const decreaseQuantity = (id) => {
        props.DecreaseQuantity(id)
    };
    const increaseQuantity = (id) => {
        props.IncreaseQuantity(id)
    };
    const DeleteCart = (id) => {
        props.DeleteCart(id)
    };
    const handleBuyProduct = async (e) => {
        // console.log(dataOderProduct);
        const dataUser = {
            gender,
            name,
            email,
            phoneNumber,
            provincial,
            district,
            wards,
            streetName,
            note,
        }
        const res = await createCloneUserService(dataUser, dataOderProduct)
        if (res && res.errCode === 0) {
            alert('thanh cong')
        } else {
            alert('that bai')
        }

    };
    // console.log(
    //     gender,
    //     name,
    //     email,
    //     phoneNumber,
    //     provincial,
    //     district,
    //     wards,
    //     streetName,
    //     note,
    // );
    return (
        <div className="cart-container">
            <div className='header__cart'>
                <span className="buy__add-product"
                    onClick={() => navigate('/')}
                ><AiOutlineLeft />Mua th??m s???n ph???m kh??c</span>
                <span className="cart__title">Gi??? h??ng c???a b???n</span>
            </div>
            <div className="middleCart">
                {products && products.length > 0 && products.map((item, i) => {
                    let isQuantityPlus = item.quantity == item.quantityItem ? false : true;
                    let isQuantityMinus = item.quantity === 1 ? false : true;
                    let colorPlus = isQuantityPlus ? `#4691d7` : `#cccccc`
                    let colorMinus = isQuantityMinus ? `#4691d7` : `#cccccc`
                    return (
                        <div className="product-item" key={i}>
                            <div className="image">
                                <img src={item.image} alt="" width="80" /><br></br>
                                <span
                                    onClick={() => DeleteCart(i)}
                                >X??a</span>
                            </div>
                            <div className="heading">
                                <div className="headding_content1">
                                    <h1>{item.name} {item.rom} </h1>
                                    <span>
                                        <NumberFormat
                                            value={item.price}
                                            displayType="text"
                                            thousandSeparator={true}
                                        />???
                                        <sup>???</sup> </span>
                                </div>
                                <div className="cart__item-control">
                                    <label htmlFor="">5 khuy???n m??i<AiFillCaretDown /></label>
                                    <div className="cart__item">
                                        <div className="cart__item-left">
                                            <label htmlFor="">m??u {item.color}<AiFillCaretDown /></label>
                                        </div>

                                        <div className="cart__item-right">
                                            <div className="minus"
                                                onClick={() => decreaseQuantity(i)}
                                                style={{ color: `${colorMinus}` }}

                                            >-</div>
                                            <span >{item.quantity}</span>
                                            <div className="plus"
                                                onClick={() => increaseQuantity(i)}
                                                style={{ color: `${colorPlus}` }}
                                            >+</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}

                <div className="price">
                    <p>T???m t??nh (1 s???n ph???m):</p>
                    <span> <NumberFormat
                        value={totalCart}
                        displayType="text"
                        thousandSeparator={true}
                    />???</span>
                </div>
                <div className="info">
                    <div className="infor-customer">
                        <h4>Th??ng tin kh??ch h??ng</h4>
                        <form className="form-customer" action="">
                            <div className="sex-customer">
                                {genderSelect && genderSelect.length > 0 && genderSelect.map((item, i) => {
                                    return (
                                        <div className="sex-customer-wrap" key={i}>
                                            <input
                                                onChange={(e) => setGender(item.keyMap)}
                                                type="radio" value={gender}
                                                name="gender" />
                                            <span>{item.valueVi}</span>
                                        </div>
                                    )
                                })}

                            </div>
                            <div className="fillinform">
                                <div className="fillname">
                                    <input
                                        onChange={(e) => setName(e.target.value)}
                                        value={name}
                                        type="text"
                                        placeholder="H??? v?? t??n" />

                                </div>
                                <div className="fillname phoneNumber">
                                    <input
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        value={phoneNumber}
                                        type="text"
                                        placeholder="S??? ??i???n tho???i" />
                                </div>
                                <div className="fillname email">
                                    <input
                                        onChange={(e) => setEmail(e.target.value)}
                                        value={email}
                                        type="text"
                                        placeholder="email" />
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="deli-address">
                        <form className="active" action="">
                            <h4>Ch???n ?????a ch??? ????? bi???t th???i gian nh???n h??ng v?? ph?? v???n chuy???n (n???u c??) </h4>
                            <div className="cntry-district">
                                <div className="btn-click country">
                                    <input
                                        onChange={(e) => setProvincial(e.target.value)}
                                        value={provincial}
                                        type="text"
                                        placeholder="Ch???n T???nh th??nh" />
                                </div>
                                <div className="btn-click district">
                                    <input
                                        onChange={(e) => setDistrict(e.target.value)}
                                        value={district}
                                        type="text"
                                        placeholder="Ch???n Qu???n / Huy???n" />
                                </div>
                            </div>

                            <div className="cntry-district">
                                <div className="btn-click country">
                                    <input
                                        onChange={(e) => setWards(e.target.value)}
                                        value={wards}
                                        type="text"
                                        placeholder="Ch???n Ph?????ng / X??" />
                                </div>
                                <div className="btn-click district">
                                    <input
                                        onChange={(e) => setStreetName(e.target.value)}
                                        value={streetName}
                                        type="text"
                                        placeholder="S??? nh??, t??n ???????ng" />
                                </div>
                            </div>


                        </form>
                    </div>
                    <div className="anotheroption">
                        <input
                            onChange={(e) => setNote(e.target.value)}
                            value={note}
                            className="leuleo"
                            type="text"
                            placeholder="Y??u c???u kh??c (kh??ng b???t bu???c)" />
                    </div>
                    <div className="footer__cart">
                        <div className="footer__cart-price">
                            <h3>T???ng ti???n:</h3>
                            <strong>36.990.000</strong>
                        </div>
                        <button
                            onClick={handleBuyProduct}
                        >?????t h??ng</button><br></br>
                        <span>C?? th??? ch???n h??nh th???c thanh to??n sau khi ?????t h??ng</span>
                    </div>
                </div>
            </div>
        </div >
    );
}
const mapDispatchToProps = (dispatch) => {
    return {
        IncreaseQuantity: (payload) => {
            dispatch(IncreaseQuantity(payload))
        },
        DecreaseQuantity: (payload) => {
            dispatch(DecreaseQuantity(payload))
        },
        DeleteCart: (payload) => {
            dispatch(DeleteCart(payload))
        },
        totalProduct: (payload) => {
            dispatch(totalProduct(payload))
        },
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        productsRedux: state.productsRedux
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Cart)




const object =
{
    id: 1,
    name: 'Iphone 13 promax',
    price: 30000000,
    colorData: [
        { color: 'white' },
        { color: 'black' },
        { color: 'red' },
    ]
}