export const WsdlEntities = `<?xml version="1.0" encoding="utf-8"?>
<wsdl:definitions name="EntitiesWinService" targetNamespace="http://www.exactsoftware.com/services/entities/" xmlns:wsdl="http://schemas.xmlsoap.org/wsdl/" xmlns:wsam="http://www.w3.org/2007/05/addressing/metadata" xmlns:wsx="http://schemas.xmlsoap.org/ws/2004/09/mex" xmlns:wsap="http://schemas.xmlsoap.org/ws/2004/08/addressing/policy" xmlns:msc="http://schemas.microsoft.com/ws/2005/12/wsdl/contract" xmlns:wsp="http://schemas.xmlsoap.org/ws/2004/09/policy" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd" xmlns:soap12="http://schemas.xmlsoap.org/wsdl/soap12/" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/" xmlns:tns="http://www.exactsoftware.com/services/entities/" xmlns:wsa10="http://www.w3.org/2005/08/addressing" xmlns:wsaw="http://www.w3.org/2006/05/addressing/wsdl" xmlns:wsa="http://schemas.xmlsoap.org/ws/2004/08/addressing">
    <wsp:Policy wsu:Id="BasicHttpBinding_entityset_policy">
        <wsp:ExactlyOne>
            <wsp:All>
                <wsp:ExactlyOne>
                    <http:NegotiateAuthentication xmlns:http="http://schemas.microsoft.com/ws/06/2004/policy/http"/>
                    <http:NtlmAuthentication xmlns:http="http://schemas.microsoft.com/ws/06/2004/policy/http"/>
                </wsp:ExactlyOne>
            </wsp:All>
        </wsp:ExactlyOne>
    </wsp:Policy>
    <wsdl:types>
        <xs:schema elementFormDefault="qualified" targetNamespace="http://www.exactsoftware.com/services/entities/" xmlns:xs="http://www.w3.org/2001/XMLSchema">
            <xs:import namespace="http://www.exactsoftware.com/schemas/entities/"/>
            <xs:element name="RetrieveSet">
                <xs:complexType>
                    <xs:sequence>
                        <xs:element minOccurs="0" name="data" nillable="true" type="q1:RetrieveCriteria" xmlns:q1="http://www.exactsoftware.com/schemas/entities/"/>
                    </xs:sequence>
                </xs:complexType>
            </xs:element>
            <xs:element name="RetrieveSetResponse">
                <xs:complexType>
                    <xs:sequence>
                        <xs:element minOccurs="0" name="RetrieveSetResult" nillable="true" type="q2:EntitiesData" xmlns:q2="http://www.exactsoftware.com/schemas/entities/"/>
                    </xs:sequence>
                </xs:complexType>
            </xs:element>
        </xs:schema>
        <xs:schema attributeFormDefault="qualified" elementFormDefault="qualified" targetNamespace="http://schemas.microsoft.com/2003/10/Serialization/" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:tns="http://schemas.microsoft.com/2003/10/Serialization/">
            <xs:element name="anyType" nillable="true" type="xs:anyType"/>
            <xs:element name="anyURI" nillable="true" type="xs:anyURI"/>
            <xs:element name="base64Binary" nillable="true" type="xs:base64Binary"/>
            <xs:element name="boolean" nillable="true" type="xs:boolean"/>
            <xs:element name="byte" nillable="true" type="xs:byte"/>
            <xs:element name="dateTime" nillable="true" type="xs:dateTime"/>
            <xs:element name="decimal" nillable="true" type="xs:decimal"/>
            <xs:element name="double" nillable="true" type="xs:double"/>
            <xs:element name="float" nillable="true" type="xs:float"/>
            <xs:element name="int" nillable="true" type="xs:int"/>
            <xs:element name="long" nillable="true" type="xs:long"/>
            <xs:element name="QName" nillable="true" type="xs:QName"/>
            <xs:element name="short" nillable="true" type="xs:short"/>
            <xs:element name="string" nillable="true" type="xs:string"/>
            <xs:element name="unsignedByte" nillable="true" type="xs:unsignedByte"/>
            <xs:element name="unsignedInt" nillable="true" type="xs:unsignedInt"/>
            <xs:element name="unsignedLong" nillable="true" type="xs:unsignedLong"/>
            <xs:element name="unsignedShort" nillable="true" type="xs:unsignedShort"/>
            <xs:element name="char" nillable="true" type="tns:char"/>
            <xs:simpleType name="char">
                <xs:restriction base="xs:int"/>
            </xs:simpleType>
            <xs:element name="duration" nillable="true" type="tns:duration"/>
            <xs:simpleType name="duration">
                <xs:restriction base="xs:duration">
                    <xs:pattern value="\\-?P(\\d*D)?(T(\\d*H)?(\\d*M)?(\\d*(\\.\\d*)?S)?)?"/>
                    <xs:minInclusive value="-P10675199DT2H48M5.4775808S"/>
                    <xs:maxInclusive value="P10675199DT2H48M5.4775807S"/>
                </xs:restriction>
            </xs:simpleType>
            <xs:element name="guid" nillable="true" type="tns:guid"/>
            <xs:simpleType name="guid">
                <xs:restriction base="xs:string">
                    <xs:pattern value="[\\da-fA-F]{8}-[\\da-fA-F]{4}-[\\da-fA-F]{4}-[\\da-fA-F]{4}-[\\da-fA-F]{12}"/>
                </xs:restriction>
            </xs:simpleType>
            <xs:attribute name="FactoryType" type="xs:QName"/>
            <xs:attribute name="Id" type="xs:ID"/>
            <xs:attribute name="Ref" type="xs:IDREF"/>
        </xs:schema>
        <xs:schema elementFormDefault="qualified" targetNamespace="http://www.exactsoftware.com/schemas/entities/" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:tns="http://www.exactsoftware.com/schemas/entities/">
            <xs:complexType name="RetrieveCriteria">
                <xs:sequence>
                    <xs:element minOccurs="0" name="BatchSize" type="xs:long"/>
                    <xs:element minOccurs="0" name="EntityName" nillable="true" type="xs:string"/>
                    <xs:element minOccurs="0" name="FilterQuery" nillable="true" type="tns:FilterQuery"/>
                    <xs:element minOccurs="0" name="SessionId" type="xs:long"/>
                </xs:sequence>
            </xs:complexType>
            <xs:element name="RetrieveCriteria" nillable="true" type="tns:RetrieveCriteria"/>
            <xs:complexType name="FilterQuery">
                <xs:sequence>
                    <xs:element minOccurs="0" name="Properties" nillable="true" type="tns:ArrayOfQueryProperty"/>
                </xs:sequence>
            </xs:complexType>
            <xs:element name="FilterQuery" nillable="true" type="tns:FilterQuery"/>
            <xs:complexType name="ArrayOfQueryProperty">
                <xs:sequence>
                    <xs:element minOccurs="0" maxOccurs="unbounded" name="QueryProperty" nillable="true" type="tns:QueryProperty"/>
                </xs:sequence>
            </xs:complexType>
            <xs:element name="ArrayOfQueryProperty" nillable="true" type="tns:ArrayOfQueryProperty"/>
            <xs:complexType name="QueryProperty">
                <xs:sequence>
                    <xs:element minOccurs="0" name="Operation" nillable="true" type="xs:string"/>
                    <xs:element minOccurs="0" name="PropertyName" nillable="true" type="xs:string"/>
                    <xs:element minOccurs="0" name="PropertyValue" nillable="true" type="xs:anyType"/>
                </xs:sequence>
            </xs:complexType>
            <xs:element name="QueryProperty" nillable="true" type="tns:QueryProperty"/>
            <xs:complexType name="EntitiesData">
                <xs:sequence>
                    <xs:element minOccurs="0" name="Entities" nillable="true" type="tns:ArrayOfEntityData"/>
                    <xs:element minOccurs="0" name="EntityName" nillable="true" type="xs:string"/>
                    <xs:element minOccurs="0" name="SessionID" type="xs:long"/>
                </xs:sequence>
            </xs:complexType>
            <xs:element name="EntitiesData" nillable="true" type="tns:EntitiesData"/>
            <xs:complexType name="ArrayOfEntityData">
                <xs:sequence>
                    <xs:element minOccurs="0" maxOccurs="unbounded" name="EntityData" nillable="true" type="tns:EntityData"/>
                </xs:sequence>
            </xs:complexType>
            <xs:element name="ArrayOfEntityData" nillable="true" type="tns:ArrayOfEntityData"/>
            <xs:complexType name="EntityData">
                <xs:sequence>
                    <xs:element minOccurs="0" name="EntityName" nillable="true" type="xs:string"/>
                    <xs:element minOccurs="0" name="Properties" nillable="true" type="tns:ArrayOfPropertyData"/>
                </xs:sequence>
            </xs:complexType>
            <xs:element name="EntityData" nillable="true" type="tns:EntityData"/>
            <xs:complexType name="ArrayOfPropertyData">
                <xs:sequence>
                    <xs:element minOccurs="0" maxOccurs="unbounded" name="PropertyData" nillable="true" type="tns:PropertyData"/>
                </xs:sequence>
            </xs:complexType>
            <xs:element name="ArrayOfPropertyData" nillable="true" type="tns:ArrayOfPropertyData"/>
            <xs:complexType name="PropertyData">
                <xs:sequence>
                    <xs:element minOccurs="0" name="Name" nillable="true" type="xs:string"/>
                    <xs:element minOccurs="0" name="NoRights" type="xs:boolean"/>
                    <xs:element minOccurs="0" name="Value" nillable="true" type="xs:anyType"/>
                </xs:sequence>
            </xs:complexType>
            <xs:element name="PropertyData" nillable="true" type="tns:PropertyData"/>
        </xs:schema>
        <xs:schema elementFormDefault="qualified" targetNamespace="http://www.exactsoftware.com/schemas/faults/" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:tns="http://www.exactsoftware.com/schemas/faults/">
            <xs:complexType name="EntityFault">
                <xs:complexContent mixed="false">
                    <xs:extension base="tns:WSExactBaseFault">
                        <xs:sequence>
                            <xs:element minOccurs="0" name="DateTime" type="xs:dateTime"/>
                            <xs:element minOccurs="0" name="Exceptions" nillable="true" type="tns:ArrayOfWSExceptionInfo"/>
                            <xs:element minOccurs="0" name="Source" nillable="true" type="xs:string"/>
                            <xs:element minOccurs="0" name="TermID" type="xs:int"/>
                            <xs:element minOccurs="0" name="User" nillable="true" type="xs:string"/>
                        </xs:sequence>
                    </xs:extension>
                </xs:complexContent>
            </xs:complexType>
            <xs:element name="EntityFault" nillable="true" type="tns:EntityFault"/>
            <xs:complexType name="WSExactBaseFault">
                <xs:sequence>
                    <xs:element minOccurs="0" name="Message" nillable="true" type="xs:string"/>
                </xs:sequence>
            </xs:complexType>
            <xs:element name="WSExactBaseFault" nillable="true" type="tns:WSExactBaseFault"/>
            <xs:complexType name="ArrayOfWSExceptionInfo">
                <xs:sequence>
                    <xs:element minOccurs="0" maxOccurs="unbounded" name="WSExceptionInfo" nillable="true" type="tns:WSExceptionInfo"/>
                </xs:sequence>
            </xs:complexType>
            <xs:element name="ArrayOfWSExceptionInfo" nillable="true" type="tns:ArrayOfWSExceptionInfo"/>
            <xs:complexType name="WSExceptionInfo">
                <xs:sequence>
                    <xs:element minOccurs="0" name="Message" nillable="true" type="xs:string"/>
                    <xs:element minOccurs="0" name="Name" nillable="true" type="xs:string"/>
                    <xs:element minOccurs="0" name="PropertyName" nillable="true" type="xs:string"/>
                    <xs:element minOccurs="0" name="TermID" type="xs:int"/>
                </xs:sequence>
            </xs:complexType>
            <xs:element name="WSExceptionInfo" nillable="true" type="tns:WSExceptionInfo"/>
        </xs:schema>
    </wsdl:types>
    <wsdl:message name="entityset_RetrieveSet_InputMessage">
        <wsdl:part name="parameters" element="tns:RetrieveSet"/>
    </wsdl:message>
    <wsdl:message name="entityset_RetrieveSet_OutputMessage">
        <wsdl:part name="parameters" element="tns:RetrieveSetResponse"/>
    </wsdl:message>
    <wsdl:message name="entityset_RetrieveSet_EntityFaultFault_FaultMessage">
        <wsdl:part name="detail" element="q1:EntityFault" xmlns:q1="http://www.exactsoftware.com/schemas/faults/"/>
    </wsdl:message>
    <wsdl:portType name="entityset">
        <wsdl:operation name="RetrieveSet">
            <wsdl:input wsaw:Action="http://www.exactsoftware.com/services/entities/entityset/RetrieveSet" message="tns:entityset_RetrieveSet_InputMessage"/>
            <wsdl:output wsaw:Action="http://www.exactsoftware.com/services/entities/entityset/RetrieveSetResponse" message="tns:entityset_RetrieveSet_OutputMessage"/>
            <wsdl:fault wsaw:Action="http://www.exactsoftware.com/services/entities/entityset/RetrieveSetEntityFaultFault" name="EntityFaultFault" message="tns:entityset_RetrieveSet_EntityFaultFault_FaultMessage"/>
        </wsdl:operation>
    </wsdl:portType>
    <wsdl:binding name="BasicHttpBinding_entityset" type="tns:entityset">
        <wsp:PolicyReference URI="#BasicHttpBinding_entityset_policy"/>
        <soap:binding transport="http://schemas.xmlsoap.org/soap/http"/>
        <wsdl:operation name="RetrieveSet">
            <soap:operation soapAction="http://www.exactsoftware.com/services/entities/entityset/RetrieveSet" style="document"/>
            <wsdl:input>
                <soap:body use="literal"/>
            </wsdl:input>
            <wsdl:output>
                <soap:body use="literal"/>
            </wsdl:output>
            <wsdl:fault name="EntityFaultFault">
                <soap:fault use="literal" name="EntityFaultFault" namespace=""/>
            </wsdl:fault>
        </wsdl:operation>
    </wsdl:binding>
    <wsdl:service name="EntitiesWinService">
        <wsdl:port name="BasicHttpBinding_entityset" binding="tns:BasicHttpBinding_entityset">
            <soap:address location="http://virtueel2.oudshoornbv.local:8010/services/Exact.Entities.EG"/>
        </wsdl:port>
    </wsdl:service>
</wsdl:definitions>`;
